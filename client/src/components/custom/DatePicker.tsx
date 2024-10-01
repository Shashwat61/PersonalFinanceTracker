import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from '../../components/ui/calendar'
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function DatePicker({ date, setDate }: { date: Date | undefined, setDate: (date: Date | undefined) => void }){
return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString() : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
)
}
export default DatePicker