/* harfialpharaby.github.io — project catalogue.
   Plain data, no build step: main.js reads this array to render the
   Projects section cards and the detail modal. Add a project by pushing
   a new object here — nothing else needs to change.

   media[].type: "image" | "video"
   - image: { type:"image", src, alt, caption }
   - video: { type:"video", src, poster, caption }   (mp4/webm file path)
     or      { type:"video", embed, caption }         (YouTube/Vimeo embed URL)
*/
window.PORTFOLIO_PROJECTS = [
  {
    id: 'content-idea-agent',
    dir: '~/projects/agentic-day1/',
    title: 'Content Idea Agent',
    shortDesc: 'A multi-tool agentic AI with guardrails that turns a topic into a set of ' +
      'short-video content ideas, built on Google\u2019s Agent Development Kit.',
    longDesc: [
      'Content Idea Agent is an experiment from my "Agentic AI" learning track: an agent that ' +
      'takes a single topic and hands back a structured set of short-video content ideas, built ' +
      'on Google\u2019s Agent Development Kit (ADK) and shipped as a TypeScript service on Cloud Run.',

      'It started as a single-tool agent — one topic in, one tool call out. The current version ' +
      'is multi-tool: the agent plans which tools to call and in what order, composing several ' +
      'calls to shape ideas around format, hook, and angle instead of returning one flat list.',

      'The bigger change is the guardrail layer sitting in front of the tools. Before any tool ' +
      'runs, the request is checked against a set of safety rules, and anything outside the ' +
      'agent\u2019s intended scope — like the malware request shown in the screenshots below — is ' +
      'refused instead of silently executed. That distinction, between "the model can technically ' +
      'do it" and "the agent is allowed to do it," was the main thing I wanted to get right here.',

      'Everything is deployed and publicly reachable, and the source is on GitHub — both linked below.'
    ],
    chips: ['Agentic AI', 'Multi-Tool', 'Guardrails', 'Google ADK', 'TypeScript'],
    media: [
      {
        type: 'image',
        src: 'sources/img/projects/day1-content-idea-agent.jpg',
        alt: 'Guardrail blocking a malicious "write malware" request in the Content Idea Agent dev UI',
        caption: 'Guardrail in action — an out-of-scope request is refused, not executed'
      }
    ],
    live: 'https://day1-content-idea-agent-509431747522.us-central1.run.app/',
    repo: 'https://github.com/harfialpharaby/agentic-day1'
  }
];
