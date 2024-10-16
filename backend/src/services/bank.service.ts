import { Bank } from "../entity/Bank"

const getBanksList = async() => {
    try {
        const banksList = await Bank.query('select * from bank')
        return banksList
    } catch (error) {
        
    }
}
export default {
    getBanksList
}