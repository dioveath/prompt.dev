import "./types/User";
import "./types/Post";
import "./types/Skill";
import "./types/SkillsOnPosts";
import "./types/AI";
import "./types/AIsOnPosts";

import { builder } from "./builder";

export const schema = builder.toSchema();