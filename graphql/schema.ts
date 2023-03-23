import "./types/User";
import "./types/Skill";
import "./types/AI";
import "./types/SkillsOnPosts";
import "./types/AIsOnPosts";
import "./types/Post";

import { builder } from "./builder";

export const schema = builder.toSchema();