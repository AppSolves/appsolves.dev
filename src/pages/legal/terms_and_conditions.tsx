import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import tacText from "@legal/terms_and_conditions.md?raw";
import ReactMarkdown from "react-markdown";

export default function TermsAndConditions() {
    return <div className="dark min-h-screen bg-background">
        <Navigation />
        <main className="prose prose-lg dark:prose-invert mx-auto pt-16 px-8 [@media(min-width:655px)]:px-0 mt-20 mb-16 transition-all duration-300">
            <ReactMarkdown>{tacText}</ReactMarkdown>
        </main>
        <Footer />
    </div>;
}