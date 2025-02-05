from discord import Embed, Member, Client
from discord.ext import commands

from env import env, config

WELCOME_CHANNEL_ID = config["guild"]["channels"]["welcome"]


class WelcomeEventCog(commands.Cog):
    def __init__(self, client: Client) -> None:
        self.client = client

    @commands.Cog.listener()
    async def on_member_join(self, member: Member):
        if env.environment != "prod":
            return

        channel = self.client.get_channel(WELCOME_CHANNEL_ID)

        embed = Embed(
            description=f"""Olá, {member.name.capitalize()}.
Seja bem-vindo(a) à Codify Community!

Você é nosso membro número {len(member.guild.members)}""",
            color=0x9F6CFD,
        )
        embed.add_field(
            name="Seguinte,",
            value="Você ainda não pode ver o resto do servidor, pois precisa configurar seu perfil em Canais & Cargos localizado no canto superior esquerdo.",
            inline=False,
        )
        embed.set_author(
            name=member.guild.name,
            icon_url=member.guild.icon.url,
        )
        embed.set_image(url=config["guild"]["banner"])
        embed.set_thumbnail(
            url=(member.avatar.url if member.avatar else member.default_avatar.url)
        )

        await channel.send(embed=embed)

        try:
            await member.send(embed=embed)
        except Exception as e:
            print(
                f"❌ EVENTS_WELCOME_ERROR: ao enviar mensagem de boas-vindas (DM) para {member.name}: {e}"
            )


async def setup(client):
    await client.add_cog(WelcomeEventCog(client))
