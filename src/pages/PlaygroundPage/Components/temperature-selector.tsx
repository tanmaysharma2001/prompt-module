import {Label} from "@/components/ui/label.tsx";
import {Slider} from "@/components/ui/slider.tsx";


interface TemperatureSelectorProps {
    tempValue: number[];
    setTempValue: (value: number[]) => void;
}

export default function TemperatureSelector(props: TemperatureSelectorProps) {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {props.tempValue}
              </span>
            </div>
            <Slider
                id="temperature"
                max={2}
                defaultValue={props.tempValue}
                step={0.01}
                onValueChange={props.setTempValue}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Temperature"
            />
        </div>
    );
}