import {Label} from "@/components/ui/label.tsx";
import {Slider} from "@/components/ui/slider.tsx";


interface MaxLengthSelectorProps {
    maxLengthValue: number[];
    setMaxLengthValue: (value: number[]) => void;
}


export default function MaxLengthSelector(props: MaxLengthSelectorProps) {
    return (
        <div>
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="maxlength">Maximum Length</Label>
                    <span
                        className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {props.maxLengthValue}
              </span>
                </div>
                <Slider
                    id="maxlength"
                    max={4096}
                    defaultValue={props.maxLengthValue}
                    step={10}
                    onValueChange={props.setMaxLengthValue}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="Maximum Length"
                />
            </div>
        </div>
    );
}