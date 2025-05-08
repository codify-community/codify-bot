import { APIEmbedField, ColorResolvable } from "discord.js";

export interface EmbedOptions {
  author?: {
    name: string;
    url?: string;
    iconURL?: string;
  };
  title?: string;
  url?: string;
  description?: string;
  fields?: APIEmbedField[];
  image?: string;
  thumbnail?: string;
  color?: ColorResolvable;
  footer?: {
    text?: string;
    iconURL?: string;
  };
  timestamp?: boolean;
}
