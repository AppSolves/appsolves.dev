import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { ExternalLink, Github } from "lucide-react";
import ScrollReveal from "./scroll-reveal";

interface Project {
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
}

const ProjectsSection = () => {
  const projects: Project[] = [
    {
      title: "LanePilot",
      description: "The worlds first real-time AI-powered traffic management system, featuring automated vehicle detection, lane allocation optimization, and dynamic control for (autonomous) cars!",
      tech: ["python", "pytorch", "docker", "opencv", "nvidia-jetson", "raspberrypi"],
      liveUrl: "https://github.com/AppSolves?tab=packages&repo_name=LanePilot",
      githubUrl: "https://github.com/AppSolves/LanePilot"
    },
    {
      title: "TikTok-LIVE-Automation",
      description: "A full-stack desktop application for TikTok Live Automation at scale. Features interactive gaming sessions and custom bots during TikTok Lives via our Plug & Play system.",
      tech: ["python", "tk-inter", "fastapi", "stripe", "nuitka", "tiktok-live", "typescript"],
      liveUrl: "https://tiktok-live-automation.appsolves.dev",
      githubUrl: "https://github.com/AppSolves/TikTok-LIVE-Automation"
    },
    {
      title: "FastAPI Users - DynamoDB Adapter", 
      description: "A ready-to-use database adapter for AWS DynamoDB, easy to use with FastAPI-Users!",
      tech: ["python", "aws", "aiopynamodb", "async", "adapter", "databases", "fastapi"],
      liveUrl: "https://pypi.org/project/fastapi-users-db-dynamodb",
      githubUrl: "https://github.com/AppSolves/fastapi-users-db-dynamodb"
    },
    {
      title: "QuickClipAI", 
      description: "A powerful tool to automatically generate AI-driven YouTube shorts, Instagram Reels and TikToks. Create engaging content in seconds with our AI-powered video generator!",
      tech: ["python", "fooocus", "moviepy", "automation", "gpt4free"],
      liveUrl: "https://youtube.com/@curioburstz",
      githubUrl: "https://github.com/AppSolves/QuickClipAI"
    }
  ];

  return (
    <section id="projects-section" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Some of my recent work
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollReveal key={index} delay={index * 200} threshold={0.2}>
              <Card className="h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md transition-colors group-hover:bg-primary/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 transition-all hover:scale-105">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 transition-all hover:scale-105">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Source
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;