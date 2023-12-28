import {Label} from "@/components/ui/label.tsx";
import {Slider} from "@/components/ui/slider.tsx";

interface TopPSelectorProps {
    topPValue: number[];
    setTopPValue: (value: number[]) => void;
}

export default function TopPSelector(props: TopPSelectorProps) {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="top-p">Top P</Label>
                <span
                    className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {props.topPValue}
              </span>
            </div>
            <Slider
                id="top-p"
                max={1}
                defaultValue={props.topPValue}
                step={0.1}
                onValueChange={props.setTopPValue}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Top P"
            />
        </div>
    );
}