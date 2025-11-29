import {createClient} from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config();

export const supabase=createClient(process.env.SUPABASE_PROJECT_KEY,process.env.SUPABASE_API)