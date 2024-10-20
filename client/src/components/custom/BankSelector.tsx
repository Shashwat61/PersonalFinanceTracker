import { Bank, UserBankMapping } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function BankSelect({ userBankMappings, onChange, placeholder }: { userBankMappings: UserBankMapping[] | undefined, onChange: (val: string) => void, placeholder: string }){
return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {userBankMappings?.map(ubm => (
            <SelectItem key={ubm.id} value={ubm.id}>{ubm?.bank?.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default BankSelect