import { Card, CardContent, CardHeader, CardTitle } from "./card";
import ScrollReveal from "./scroll-reveal";

const AboutSection = () => {
  return (
    <section className="py-24 bg-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              About Me
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get to know me better
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">Hello there,</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">I'm AppSolves, a software developer with a passion for crafting digital solutions that make a difference. My enthusiasm for coding knows no bounds.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">My journey into the world of software development began at an early age, driven by a deep curiosity to understand the magic behind the virtual realm. Coding, especially in Python and Dart, has become my creative canvas, where I transform ideas into functional programs and projects.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">With each line of code I write, I aim to create tools and applications that not only function flawlessly but also enhance the lives of those who use them. My goal is to make technology more accessible and user-friendly for everyone.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">Apart from my coding adventures, I'm also a fitness enthusiast. When I'm not immersed in lines of code, you can often find me at the gym, pushing my limits and striving for personal growth.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">I'm always up for discussions on a wide range of topics, whether it's diving into the intricacies of coding, exploring the mysteries of science, or simply chatting about the world around us.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">Thank you for visiting my website, and I look forward to sharing my journey with you.</p>
                <br></br>
                <p className="text-muted-foreground leading-relaxed">Best regards,</p>
                <p className="text-muted-foreground leading-relaxed">AppSolves</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Skills Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScrollReveal delay={400}>
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    React, TypeScript, Next.js, Tailwind CSS, Tk-Inter
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Node.js, Python, PostgreSQL, DynamoDB, AWS, APIs
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Git, Docker, CUDA, Flutter, CMake, Blender, GIMP, PyTorch, AWS, Figma
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={700}>
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI, Open Source, UI/UX, Desktop Apps, SaaS, Performance
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;