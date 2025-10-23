/**
 * 此代码由百度AI生成，对关键字：typescript object 深度复制
 * 对AI生成的代码作了修改
 * @param obj
 * @returns
 */
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  //   if (obj instanceof Array) {
  //     return obj.slice() as any;
  //   }

  if (obj instanceof Array)
    return obj.map((item: any) => deepCopy<any>(item)) as any;

  const newObj = { ...(obj as { [key: string]: any }) };
  Object.keys(newObj).forEach((key) => {
    newObj[key] = deepCopy(newObj[key]);
  });

  return newObj as T;
}

// 来自百度AI的代码
// function deepCopy<T>(obj: T): T {
//     if (obj === null || typeof obj !== 'object') {
//         return obj;
//     }

//     if (obj instanceof Date) {
//         return new Date(obj.getTime()) as any;
//     }

//     if (obj instanceof Array) {
//         return obj.slice() as any;
//     }

//     const newObj = { ...obj };
//     Object.keys(newObj).forEach(key => {
//         newObj[key] = deepCopy(newObj[key]);
//     });

//     return newObj as T;
// }

// // 使用例子
// const originalObject = { a: 1, b: { c: 2, d: [3, 4] } };
// const copiedObject = deepCopy(originalObject);

// // 修改原始对象，验证深拷贝
// originalObject.b.c = 5;
// console.log(copiedObject.b.c); // 输出 2，原对象和拷贝对象不影响

// https://stackoverflow.com/questions/28150967/typescript-cloning-object
// const clone = <T>(source: T): T => {
//     if (source === null) return source

//     if (source instanceof Date) return new Date(source.getTime()) as any

//     if (source instanceof Array) return source.map((item: any) => clone<any>(item)) as any

//     if (typeof source === 'object' && source !== {}) {
//       const clonnedObj = { ...(source as { [key: string]: any }) } as { [key: string]: any }
//       Object.keys(clonnedObj).forEach(prop => {
//         clonnedObj[prop] = clone<any>(clonnedObj[prop])
//       })

//       return clonnedObj as T
//     }

//     return source
//   }
