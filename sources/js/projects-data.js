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
      'short-video content ideas, built on Google’s Agent Development Kit.',
    longDesc: [
      'Content Idea Agent is an experiment from my "Agentic AI" learning track: an agent that ' +
      'takes a single topic and hands back a structured set of short-video content ideas, built ' +
      'on Google’s Agent Development Kit (ADK) and shipped as a TypeScript service on Cloud Run.',

      'It started as a single-tool agent — one topic in, one tool call out. The current version ' +
      'is multi-tool: the agent plans which tools to call and in what order, composing several ' +
      'calls to shape ideas around format, hook, and angle instead of returning one flat list.',

      'The bigger change is the guardrail layer sitting in front of the tools. Before any tool ' +
      'runs, the request is checked against a set of safety rules, and anything outside the ' +
      'agent’s intended scope — like the malware request shown in the screenshots below — is ' +
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
  },
  {
    id: 'content-pipeline-agent',
    dir: '~/projects/agentic-day3/',
    title: 'Content Pipeline Agent',
    shortDesc: 'A multi-agent pipeline that sources trending topics, drafts captions, and ' +
      'runs them through a review agent before approval, built on Google’s Agent Development Kit.',
    longDesc: [
      'Content Pipeline Agent is the "Day 3" step in my Agentic AI learning track, moving from a ' +
      'single agent to a small team of agents that hand work off to one another. A ' +
      'ContentPipelineAgent orchestrates three specialists: a SourcingAgent that calls a ' +
      'fetch_trending_topics tool to pull in what’s currently trending, a SummarizerAgent that ' +
      'turns those topics into draft captions, and a ReviewAgent that checks the drafts before ' +
      'anything is marked approved.',

      'That review step is the part I cared about most. Drafts move through a visible ' +
      'raw_topics → captions → final_captions state machine, and the ReviewAgent can revise ' +
      'wording before signing off with an explicit "APPROVED" — so what ships is never just the ' +
      'first draft a model produces; there’s a checked handoff between generation and approval.',

      'The gallery below includes the agent graph from Google’s ADK dev UI (SourcingAgent, ' +
      'SummarizerAgent, and ReviewAgent branching off the orchestrator) and a terminal run of the ' +
      'project’s own pipeline test script, alongside the approval trace itself.',

      'Deployed on Cloud Run and open source — both linked below.'
    ],
    chips: ['Agentic AI', 'Multi-Agent', 'Pipeline', 'Google ADK', 'TypeScript'],
    media: [
      {
        type: 'image',
        src: 'sources/img/projects/day3/thumbnail.jpg',
        alt: 'Content Pipeline Agent dev UI showing draft captions approved by the ReviewAgent',
        caption: 'Draft captions moving from generated to APPROVED via the ReviewAgent'
      },
      {
        type: 'video',
        src: 'sources/video/projects/day3/agent-graph-demo.mp4',
        caption: 'Agent graph: ContentPipelineAgent orchestrating SourcingAgent, SummarizerAgent, and ReviewAgent'
      },
      {
        type: 'video',
        src: 'sources/video/projects/day3/test-pipeline-run.mp4',
        caption: 'Running the project’s test-pipeline.sh script end to end'
      }
    ],
    live: 'https://day3-content-pipeline-agent-509431747522.us-central1.run.app/',
    repo: 'https://github.com/harfialpharaby/agentic-day3'
  }
];
