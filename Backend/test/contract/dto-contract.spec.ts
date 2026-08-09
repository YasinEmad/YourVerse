import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import {
  PresentationRow,
  ProductRow,
  toBaseProductDetailDto,
  toProductListItemDto,
} from "../../src/catalog/product.mapper";
import { toWorldDetailDto, toWorldSummaryDto, WorldRow } from "../../src/worlds/world.mapper";
import { CartRow, toCartDto } from "../../src/cart/cart.mapper";
import { OrderRow, toOrderDto } from "../../src/orders/orders.mapper";
import { UserRow } from "../../src/users/user.row";
import { toUserDto } from "../../src/users/users.mapper";

// ---------------------------------------------------------------------------
// Contract fixture-diff test.
//
// Compares the serialized shapes produced by the backend mappers against the
// ACTUAL DTO interfaces in Frontend/lib/api/types.ts (parsed via the TypeScript
// compiler, resolving the `@/types/product` import), so a field rename on
// either side fails CI. Phase 6 will formalize this into a shared contract
// tool; this is the drift-check seed.
//
// Frontend file currently defines LocalizedTextDto = { en, ar } — the backend
// mirrors the file exactly.
// ---------------------------------------------------------------------------

const FRONTEND_ROOT = path.resolve(__dirname, "../../../Frontend");
const FRONTEND_TYPES_FILE = path.join(FRONTEND_ROOT, "lib/api/types.ts");
const FRONTEND_PRODUCT_TYPES_FILE = path.join(FRONTEND_ROOT, "types/product.ts");

type ShapeNode =
  | { kind: "scalar"; type: string; value?: string | number | boolean }
  | { kind: "nested"; name: string; shape: Map<string, Member> }
  | { kind: "array"; name: string; shape: Map<string, Member> };

interface Member {
  name: string;
  optional: boolean;
  node: ShapeNode;
}

class FrontendTypesParser {
  private sources: ts.SourceFile[] = [];
  private interfaceCache = new Map<string, Map<string, Member>>();

  constructor() {
    for (const file of [FRONTEND_TYPES_FILE, FRONTEND_PRODUCT_TYPES_FILE]) {
      if (!fs.existsSync(file)) {
        throw new Error(
          `Cannot run contract diff: frontend types file not found at ${file}. ` +
            "The contract is Frontend/lib/api/types.ts; this test must run with the repo checked out.",
        );
      }
      const source = ts.createSourceFile(
        file,
        fs.readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      this.sources.push(source);
    }
  }

  shape(interfaceName: string): Map<string, Member> {
    const cached = this.interfaceCache.get(interfaceName);
    if (cached) return cached;
    const found = this.resolveInterface(interfaceName);
    if (!found) {
      throw new Error(`Interface "${interfaceName}" not found in frontend types`);
    }
    this.interfaceCache.set(interfaceName, found);
    return found;
  }

  private resolveInterface(name: string): Map<string, Member> | undefined {
    for (const source of this.sources) {
      for (const statement of source.statements) {
        if (ts.isInterfaceDeclaration(statement) && statement.name.text === name) {
          return this.membersOf(statement, source);
        }
      }
    }
    return undefined;
  }

  private resolveTypeAlias(name: string, source: ts.SourceFile): ShapeNode | undefined {
    for (const statement of source.statements) {
      if (ts.isTypeAliasDeclaration(statement) && statement.name.text === name && statement.type) {
        return this.typeToNode(statement.type, source);
      }
    }
    return undefined;
  }

  private membersOf(
    declaration: ts.InterfaceDeclaration,
    source: ts.SourceFile,
  ): Map<string, Member> {
    const members = new Map<string, Member>();

    for (const clause of declaration.heritageClauses ?? []) {
      if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;
      for (const type of clause.types) {
        const parentName = type.expression.getText();
        const parent = this.interfaceInFile(parentName, source) ?? this.resolveInterface(parentName);
        if (parent) {
          for (const [memberName, member] of parent) {
            if (!members.has(memberName)) members.set(memberName, member);
          }
        }
      }
    }

    for (const member of declaration.members) {
      if (!ts.isPropertySignature(member)) continue;
      const memberName = member.name.getText();
      members.set(memberName, {
        name: memberName,
        optional: Boolean(member.questionToken),
        node: this.typeToNode(member.type, source),
      });
    }
    return members;
  }

  private interfaceInFile(
    name: string,
    source: ts.SourceFile,
  ): Map<string, Member> | undefined {
    for (const statement of source.statements) {
      if (ts.isInterfaceDeclaration(statement) && statement.name.text === name) {
        return this.membersOf(statement, source);
      }
    }
    return undefined;
  }

  private typeToNode(typeNode: ts.TypeNode | undefined, source: ts.SourceFile): ShapeNode {
    if (!typeNode) return { kind: "scalar", type: "unknown" };

    if (ts.isArrayTypeNode(typeNode)) {
      const inner = typeNode.elementType;
      if (ts.isTypeReferenceNode(inner)) {
        const name = inner.typeName.getText();
        const alias = this.resolveTypeAlias(name, source);
        if (alias) {
          return { kind: "array", name, shape: alias.kind === "nested" || alias.kind === "array" ? alias.shape : new Map() };
        }
        const shape = this.interfaceInFile(name, source) ?? this.resolveInterface(name);
        return { kind: "array", name, shape: shape ?? new Map() };
      }
      return { kind: "array", name: inner.getText(), shape: new Map() };
    }

    if (ts.isTypeReferenceNode(typeNode)) {
      const name = typeNode.typeName.getText();
      // Type aliases (e.g. OrderStatus) may resolve to a union or scalar.
      const alias = this.resolveTypeAlias(name, source);
      if (alias) return alias;
      const shape = this.interfaceInFile(name, source) ?? this.resolveInterface(name);
      return { kind: "nested", name, shape: shape ?? new Map() };
    }

    if (ts.isUnionTypeNode(typeNode)) {
      return { kind: "scalar", type: typeNode.types.map((t) => t.getText()).join(" | ") };
    }

    return { kind: "scalar", type: typeNode.getText() };
  }
}

// --- Backend side: build ShapeNodes from the real mapper output ------------

function shapeOf(value: unknown): ShapeNode {
  if (Array.isArray(value)) {
    const inner = value.length > 0 ? shapeOf(value[0]) : null;
    return {
      kind: "array",
      name: "item",
      shape: inner && (inner.kind === "nested" || inner.kind === "array") ? inner.shape : new Map<string, Member>(),
    };
  }
  if (value !== null && typeof value === "object") {
    const shape = new Map<string, Member>();
    for (const [key, child] of Object.entries(value)) {
      shape.set(key, { name: key, optional: false, node: shapeOf(child) });
    }
    return { kind: "nested", name: "object", shape };
  }
  const type = value === null ? "null" : typeof value;
  return {
    kind: "scalar",
    type,
    value: value === null || typeof value === "object" ? undefined : (value as string | number | boolean),
  };
}

function scalarBase(type: string): string {
  return type
    .split("|")
    .map((part) => part.trim().replace(/^"|"$/g, ""))
    .filter((part) => part !== "null" && part !== "unknown")
    .sort()
    .join("|");
}

function scalarCompatible(
  frontend: string,
  backend: string,
  backendValue?: string | number | boolean,
): boolean {
  const f = scalarBase(frontend);
  const b = scalarBase(backend);
  if (f === b) return true;
  // Frontend enum-style union (e.g. OrderStatus): accept when the backend's
  // concrete sample value is a member of the union.
  if (f.includes("|") && typeof backendValue === "string") {
    return f.split("|").includes(backendValue);
  }
  return false;
}

function typeLabel(node: ShapeNode): string {
  if (node.kind === "scalar") return node.type;
  if (node.kind === "array") return `${node.name}[]`;
  return node.name;
}

function nestedShapeOf(node: ShapeNode): Map<string, Member> {
  return node.kind === "nested" || node.kind === "array" ? node.shape : new Map();
}

function compareDto(
  dtoName: string,
  frontend: Map<string, Member>,
  backendValue: unknown,
): string[] {
  const errors: string[] = [];
  const lines: string[] = [];
  const backend = nestedShapeOf(shapeOf(backendValue));

  for (const [name, member] of frontend) {
    const has = backend.has(name);
    if (has) {
      const backendMember = backend.get(name)!;
      const f = member.node;
      const b = backendMember.node;
      if (f.kind === "nested" && b.kind === "nested") {
        lines.push(`${name.padEnd(18)} object`);
        const sub = compareMemberSet(`${dtoName}.${name}`, f.shape, b.shape);
        errors.push(...sub);
      } else if (f.kind === "array" && b.kind === "array") {
        lines.push(`${name.padEnd(18)} array`);
        const sub = compareMemberSet(`${dtoName}.${name}[]`, f.shape, b.shape);
        errors.push(...sub);
      } else if (f.kind === "scalar" && b.kind === "scalar") {
        lines.push(`${name.padEnd(18)} ${f.type}${member.optional ? "?" : ""}`);
        if (!scalarCompatible(f.type, b.type, b.value)) {
          errors.push(`${dtoName}.${name}: type mismatch (frontend "${f.type}" vs backend "${b.type}")`);
        }
      } else {
        errors.push(`${dtoName}.${name}: shape mismatch (frontend ${f.kind}, backend ${b.kind})`);
      }
    } else if (member.optional) {
      lines.push(`${name.padEnd(18)} ${typeLabel(member.node)}?  [optional, absent in sample]`);
    } else {
      errors.push(`${dtoName}.${name}: REQUIRED frontend field missing from backend`);
    }
  }

  for (const [name] of backend) {
    if (!frontend.has(name)) {
      errors.push(`${dtoName}.${name}: extra field present in backend, absent from frontend`);
    }
  }

  if (lines.length > 0) {
    console.log(`\n  ${dtoName}`);
    for (const line of lines) console.log(`    ${line}`);
  }
  return errors;
}

function compareMemberSet(
  prefix: string,
  frontend: Map<string, Member>,
  backend: Map<string, Member>,
): string[] {
  const errors: string[] = [];
  for (const [name, member] of frontend) {
    if (!backend.has(name) && !member.optional) {
      errors.push(`${prefix}.${name}: REQUIRED frontend field missing from backend`);
    }
  }
  for (const [name] of backend) {
    if (!frontend.has(name)) {
      errors.push(`${prefix}.${name}: extra field present in backend, absent from frontend`);
    }
  }
  return errors;
}

// --- Sample rows that exercise every optional field ------------------------

const fullPresentationRow: PresentationRow = {
  title: { en: "Mono Hoodie", ar: "مونو" },
  subtitle: "240gsm graphite fleece",
  primaryValue: "4.9k",
  secondaryValue: "2d ago",
  imageUrl: "https://example.com/mono-hoodie.png",
  accentColor: "#7CFF9E",
  badge: "New Build",
  isAvailable: true,
  product: { slug: "the-one-hoodie", basePrice: 8900, currency: "USD" },
};

const fullProductRow: ProductRow = {
  slug: "hyperion-runtime",
  baseTitle: "Hyperion Runtime",
  basePrice: 9900,
  currency: "USD",
};

const fullWorldRow: WorldRow = {
  slug: "tech",
  name: { en: "The Instrument Panel", ar: "لوحة العدّادات" },
  tagline: { en: "Precision hardware.", ar: "أجهزة دقيقة." },
  isActive: true,
};

const fullCartRow: CartRow = {
  id: "cart-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
  sessionId: "9f8e7d6c-5b4a-3210-fedc-ba9876543210",
  items: [
    {
      id: "line-00000000-0000-4000-8000-000000000001",
      quantity: 2,
      product: { slug: "the-one-hoodie", baseTitle: "Mono Hoodie", basePrice: 8900, currency: "USD" },
    },
  ],
};

const fullOrderRow: OrderRow = {
  id: "order-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
  status: "PENDING",
  subtotal: 17800,
  shipping: 500,
  tax: 1780,
  total: 20080,
  currency: "USD",
  shippingAddress: {
    fullName: "Test User",
    email: "test@example.com",
    phone: "+1 555 0100",
    line1: "1 Test Street",
    line2: "Apt 2",
    city: "Cairo",
    region: "Giza",
    postalCode: "11511",
    country: "EG",
  },
  createdAt: new Date("2026-01-15T12:00:00.000Z"),
  items: [
    {
      id: "line-00000000-0000-4000-8000-000000000002",
      quantity: 2,
      unitPrice: 8900,
      product: { slug: "the-one-hoodie", baseTitle: "Mono Hoodie" },
    },
  ],
};

const fullUserRow: UserRow = {
  id: "user-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
  firebaseUid: "firebase-uid-1a2b3c4d5e6f",
  email: "alice@yourverse.test",
  name: "Alice",
  favoriteWorldSlug: "poetry",
  createdAt: new Date("2026-01-15T12:00:00.000Z"),
  updatedAt: new Date("2026-01-15T12:00:00.000Z"),
};

const backendSamples: Array<{ name: string; value: unknown }> = [
  { name: "WorldSummaryDto", value: toWorldSummaryDto(fullWorldRow) },
  {
    name: "WorldDetailDto",
    value: toWorldDetailDto(fullWorldRow, [toProductListItemDto(fullPresentationRow)]),
  },
  {
    name: "ProductListResponseDto",
    value: {
      items: [toProductListItemDto(fullPresentationRow)],
      nextCursor: "the-one-hoodie",
    },
  },
  { name: "ProductListItemDto", value: toProductListItemDto(fullPresentationRow) },
  { name: "ProductDetailDto", value: toProductListItemDto(fullPresentationRow) },
  // The no-world base view is intentionally a partial ProductViewModel; comparing
  // against ProductViewModel asserts it never emits fields the contract doesn't know.
  { name: "ProductViewModel", value: toBaseProductDetailDto(fullProductRow) },
  { name: "CartDto", value: toCartDto(fullCartRow) },
  { name: "CartItemDto", value: toCartDto(fullCartRow).items[0] },
  // Phase 2 (COD-only): the frontend dropped paymentMethodId, so OrderDto now
  // matches the backend field-for-field and joins the contract diff. OrderStatus
  // is a union on the frontend side; scalarCompatible treats a concrete backend
  // sample value as compatible when it is a member of the union.
  { name: "OrderDto", value: toOrderDto(fullOrderRow) },
  { name: "OrderItemDto", value: toOrderDto(fullOrderRow).items[0] },
  { name: "OrderListResponseDto", value: { items: [toOrderDto(fullOrderRow)] } },
  // Phase 4A: users contract joins the diff. SessionDto is the POST /users/session
  // body; UserDto is also returned by GET /users/me.
  { name: "UserDto", value: toUserDto(fullUserRow) },
  { name: "SessionDto", value: { user: toUserDto(fullUserRow) } },
];

describe("DTO contract vs Frontend/lib/api/types.ts", () => {
  const parser = new FrontendTypesParser();

  it("parses the frontend contract file", () => {
    expect(parser.shape("WorldSummaryDto")).toBeDefined();
    expect(parser.shape("ProductListItemDto")).toBeDefined();
  });

  it("matches every response DTO field-for-field", () => {
    const allErrors: string[] = [];

    for (const sample of backendSamples) {
      const frontendShape = parser.shape(sample.name);
      const errors = compareDto(sample.name, frontendShape, sample.value);
      allErrors.push(...errors);
    }

    console.log("\n── Contract comparison report ──────────────────────────────");
    console.log(`Frontend contract: ${path.relative(process.cwd(), FRONTEND_TYPES_FILE)}`);
    console.log(
      allErrors.length === 0
        ? "RESULT: all DTOs match the frontend contract"
        : `RESULT: ${allErrors.length} mismatch(es)`,
    );
    for (const error of allErrors) console.log(`  ✗ ${error}`);

    expect(allErrors).toEqual([]);
  });
});
