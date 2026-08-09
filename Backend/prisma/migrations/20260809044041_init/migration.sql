-- CreateTable
CREATE TABLE "World" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "tagline" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "World_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "baseTitle" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductWorldPresentation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "subtitle" TEXT,
    "primaryValue" TEXT NOT NULL,
    "secondaryValue" TEXT,
    "imageUrl" TEXT,
    "accentColor" TEXT,
    "badge" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortWeight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductWorldPresentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "World_slug_key" ON "World"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "ProductWorldPresentation_worldId_isAvailable_sortWeight_idx" ON "ProductWorldPresentation"("worldId", "isAvailable", "sortWeight");

-- CreateIndex
CREATE UNIQUE INDEX "ProductWorldPresentation_productId_worldId_key" ON "ProductWorldPresentation"("productId", "worldId");

-- AddForeignKey
ALTER TABLE "ProductWorldPresentation" ADD CONSTRAINT "ProductWorldPresentation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWorldPresentation" ADD CONSTRAINT "ProductWorldPresentation_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
