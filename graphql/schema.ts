import "./types/User";
import "./types/Skill";
import "./types/AI";
import "./types/SkillsOnPosts";
import "./types/AIsOnPosts";
import "./types/AICategory";
import "./types/Post";
import "./types/Comment";

import { builder } from "./builder";

export const schema = builder.toSchema();