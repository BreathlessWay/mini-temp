export class A{

}

export const a = async ()=>{
    await new Promise((resolve, reject) => {
        resolve(1)
    })
}