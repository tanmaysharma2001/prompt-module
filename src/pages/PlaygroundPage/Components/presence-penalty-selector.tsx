import {Label} from "@/components/ui/label.tsx";
import {Slider} from "@/components/ui/slider.tsx";


interface PresencePenaltyProps {
    presencePenaltyValue: number[];
    setPresencePenaltyValue: (value: number[]) => void;
}

export default function PresencePenaltySelector(props: PresencePenaltyProps) {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="top-p">Presence Penalty</Label>
                <span
                    className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {props.presencePenaltyValue}
              </span>
            </div>
            <Slider
                id="top-p"
                max={1}
                defaultValue={props.presencePenaltyValue}
                step={0.1}
                onValueChange={props.setPresencePenaltyValue}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Top P"
            />
        </div>
    );
}