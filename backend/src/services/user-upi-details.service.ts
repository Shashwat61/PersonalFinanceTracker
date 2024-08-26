import { UserUpiDetails } from "../entity/UserUpiDetails"

const findOrCreate = async(upi_id: string) => {
    const userUpiDetails = await UserUpiDetails.findOneBy({upi_id: upi_id})
    if (userUpiDetails) return userUpiDetails
    const newUserUpiDetails = new UserUpiDetails()
    newUserUpiDetails.upi_id = upi_id
    await newUserUpiDetails.save()
    return newUserUpiDetails
}

export default {
    findOrCreate
}