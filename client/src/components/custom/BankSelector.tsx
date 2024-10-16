import { Bank } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function BankSelect({ banks, onChange, placeholder }: { banks: Bank[] | undefined, onChange: (val: string) => void, placeholder: string }){
return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {banks?.map(bank => (
            <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default BankSelect