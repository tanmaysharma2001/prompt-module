import {Label} from "@/components/ui/label.tsx";
import {Slider} from "@/components/ui/slider.tsx";

interface FrequencyPenaltyProps {
    freqPenaltyValue: number[];
    setFreqPenaltyValue: (value: number[]) => void;
}

export default function FrequencyPenaltySelector(props: FrequencyPenaltyProps) {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="top-p">Frequency Penalty</Label>
                <span
                    className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {props.freqPenaltyValue}
              </span>
            </div>
            <Slider
                id="top-p"
                max={1}
                defaultValue={props.freqPenaltyValue}
                step={0.1}
                onValueChange={props.setFreqPenaltyValue}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Top P"
            />
        </div>
    );
}