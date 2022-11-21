// slice text into span
export const textToSpan = (innerText,className) => {
    const result = innerText.replace(/\S+/g,`<span class="${className}">$&</span>`);
    return result;
}

export const pathToArr = (pathDescription)=>{
    const numberRegex = /[\-\.0-9]+/g;
    const pathRegex = /([a-zA-Z]{1})(.+?)(?=[a-zA-Z]{1}|$)/g;
    
    let resArr = [...pathDescription.matchAll(pathRegex)];


    let endArr = [];
    resArr.forEach(element => {
        let atomicArr = [];
        atomicArr.push(element[1]);
        atomicArr.push(...element[2].match(numberRegex));
        endArr.push(atomicArr);
    })

    return endArr;
}