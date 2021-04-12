import conf from "config/env";

console.log(conf);

function testable(target: any) {
  target.isTestable = true;
}

@testable
export class A {
  m() {}
}

export const a = async () => {
  await new Promise((resolve, reject) => {
    resolve(1);
  });
};
