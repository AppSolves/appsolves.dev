import Footer from "@/components/ui/footer";
import Navigation from "@/components/ui/navigation";
import privacyText from "@legal/privacy_policy.md?raw";
import ReactMarkdown from "react-markdown";

export default function PrivacyPolicy() {
    return <div className="dark min-h-screen bg-background">
        <Navigation />
        <main className="prose prose-lg dark:prose-invert mx-auto pt-16 mt-20 mb-16">
            <ReactMarkdown>{privacyText}</ReactMarkdown>
        </main>
        <Footer />
    </div>;
}