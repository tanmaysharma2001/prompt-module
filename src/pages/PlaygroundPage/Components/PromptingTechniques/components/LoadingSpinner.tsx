import "@/pages/PlaygroundPage/Components/PromptingTechniques/components/style.css";

export default function LoadingSpinner() {
    return (
        <div className={"flex flex-row justify-center p-4"}>
            <div className={"spinner-container"}>
                <div className={"loading-spinner"}>
                </div>
            </div>
        </div>
    );
}