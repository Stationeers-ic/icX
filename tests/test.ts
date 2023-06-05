import {IcX} from "../src";
import * as fs from "fs";

const code = fs.readFileSync(__dirname + "/scripts/test.icx.js").toString()
const obj = new IcX(code)
const compiled = obj.run()

fs.writeFileSync(__dirname + "/test.ic10",compiled)
console.log(obj.program)
fs.writeFileSync(__dirname + "/test.json",JSON.stringify(obj.program, null,2))
// console.log(obj.vars)
