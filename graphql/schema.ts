import "./types/User";
import "./types/Skill";
import "./types/AI";
import "./types/SkillsOnPosts";
import "./types/AIsOnPosts";
import "./types/AICategory";
import "./types/Post";
import "./types/Comment";
import "./types/VotesOnPosts";
import "./types/VotesOnComments";
import "./types/Tool";
import "./types/ReviewsOnTools";
import "./types/UsersOnTools";
import "./types/ToolCategory";
import "./types/ToolsOnPosts";

import { builder } from "./builder";

export const schema = builder.toSchema();