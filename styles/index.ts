export type StylesheetModule = Record<string, string>

type StylesheetModules = StylesheetModule | StylesheetModule[]
type ClassNames = string | (string|undefined|null)[] | TemplateStringsArray

/**
 * @param {string|string[]} className - Classes to be converted to module classes
 * @param {string|string[]} [rawClassNames] - Raw classes to be included in output
 * @returns {string} Classes converted to module classes with untouched raw input
 */
export const createStyleShortcut = (stylesheet: StylesheetModules) => (classes: ClassNames, rawClasses: ClassNames = "") => {
    stylesheet = stylesheet instanceof Array ? stylesheet : [stylesheet]
    classes = classes instanceof Array ? 
        Array.from(classes).filter(s => typeof s === "string").join(" ") : classes
    rawClasses = rawClasses instanceof Array ? 
        Array.from(rawClasses).filter(s => typeof s === "string").join(" ") : rawClasses
    const items = classes.trim().split(/ +/gmi)
    const rawItems = rawClasses.trim().split(/ +/gmi)

    let output: string[] = []

    for(const item of items){
        let found = false
        for(const stylesheetModule of stylesheet){
            if(item in stylesheetModule){
                output.push(stylesheetModule[item])
                found = true
            }
        }

        if(found === false){
            output.push(item)
        }
    }

    return output.concat(rawItems).join(" ").trim()
}