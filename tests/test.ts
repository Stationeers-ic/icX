import {IcX} from "../src";
import * as fs from "fs";

const obj = new IcX
obj.run(fs.readFileSync(__dirname + "/test.icx.js").toString())
