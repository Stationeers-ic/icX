import {IcX} from "../src";
import * as fs from "fs";

const obj = new IcX
const compiled = obj.run(fs.readFileSync(__dirname + "/scripts/test.icx.js").toString())
fs.writeFileSync(__dirname + "/test.ic10",compiled)
// console.log(obj.vars)
