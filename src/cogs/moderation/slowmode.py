from discord.ext import commands
from discord.ext.commands import Context
from discord import app_commands, Client

from use_cases.moderation.slowmode import SlowmodeUseCase


class SlowModeCog(commands.Cog):
    def __init__(self, client: Client) -> None:
        self.client = client

    @commands.command(name="slowmode", aliases=["modolento"])
    @commands.has_permissions(manage_channels=True)
    async def slowmode(self, ctx: Context, tempo: str = "5s"):
        slowmode_use_case = SlowmodeUseCase(send=ctx.send, author=ctx.author)
        await slowmode_use_case.execute(ctx.channel, tempo)

    group = app_commands.Group(
        name="modo",
        description="...",
    )

    @group.command(
        name="lento",
        description="Define o slow mode de um canal.",
    )
    @app_commands.default_permissions(manage_channels=True)
    @app_commands.checks.has_permissions(manage_channels=True)
    @app_commands.choices(
        tempo=[
            app_commands.Choice(name="Remover", value="0s"),
            app_commands.Choice(name="Rápido", value="5s"),
            app_commands.Choice(name="Médio", value="30s"),
            app_commands.Choice(name="Lento", value="1m"),
            app_commands.Choice(name="Muito lento", value="5m"),
        ]
    )
    async def slowmode_slash(self, interaction, tempo: app_commands.Choice[str]):
        slowmode_use_case = SlowmodeUseCase(
            send=interaction.response.send_message,
            author=interaction.user,
            ephemeral=True,
        )
        await slowmode_use_case.execute(interaction.channel, tempo.value)


async def setup(client):
    await client.add_cog(SlowModeCog(client))
