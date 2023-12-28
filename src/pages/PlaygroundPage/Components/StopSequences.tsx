import { Input } from "@/components/ui/input.tsx"

export default function StopSequences() {
    return (
      <div className={"text-left"}>
          <h4>
              Stop Sequences
          </h4>
          <p className={"text-xs text-gray-500"}>Enter sequence and press Tab</p>
          <Input className="mt-2 mb-2" type="text" />
      </div>
    );
}