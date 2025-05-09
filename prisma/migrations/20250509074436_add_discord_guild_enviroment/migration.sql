-- CreateTable
CREATE TABLE "DiscordGuildEnviroment" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "initialMoneyValue" DECIMAL(12,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordGuildEnviroment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuildEnviroment_guildId_key" ON "DiscordGuildEnviroment"("guildId");

-- AddForeignKey
ALTER TABLE "DiscordGuildEnviroment" ADD CONSTRAINT "DiscordGuildEnviroment_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "DiscordGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
