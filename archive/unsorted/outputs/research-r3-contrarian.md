# R3: Contrarian Viewpoints -- The Case FOR Natural Language Programming

**Research Agent R3 | Ledger IDs: T5, T6**
**Generated: 2026-04-02**

---

## Executive Summary

This report steel-mans the strongest possible arguments *against* Dijkstra's position that natural language programming is "foolish." Drawing on CS/AI leaders, HCI pioneers, cognitive scientists, and philosophers of language, it constructs a multi-layered case that natural language is not merely a viable programming medium but may represent the natural evolutionary endpoint of the abstraction stack. The arguments range from the pragmatic (LLMs have solved the parsing problem Dijkstra identified) to the philosophical (language games theory suggests meaning is constituted by use, not formal structure) to the cognitive (human-AI programming is a distributed cognitive system that extends the mind).

---

## 1. Arguments from CS/AI Leaders

### 1.1 Karpathy: English as Programming Language

**Core claim:** "The hottest new programming language is English." (January 2023)

Andrej Karpathy's argument has evolved through three distinct phases, each building on the last:

**Phase 1 -- Software 2.0 (2017).** In his influential blog post, Karpathy argued that neural networks represent a fundamentally new kind of software. In Software 1.0, humans write explicit instructions in Python or C++. In Software 2.0, the "code" is neural network weights -- "written in much more abstract, human unfriendly language." The programmer's job shifts from writing instructions to specifying goals and curating datasets. This was the conceptual seed: if the code is weights, then the interface to code need not be code.

**Phase 2 -- English as Programming Language (2023).** Karpathy extended the Software 2.0 thesis to its logical conclusion. If LLMs can translate natural language intent into working code, then English *is* a programming language. The key insight: "Computers can now understand natural language... computers can write code based on that understanding (including filling in the gaps)... and humans already use English for large parts of the development process (documentation, comments, issues, PR conversations, group chat conversations, etc)." The gap between how humans already communicate about code and how they instruct computers has collapsed.

**Phase 3 -- Vibe Coding to Agentic Engineering (2025-2026).** Karpathy coined "vibe coding" in February 2025 to describe a practice where developers "fully give in to the vibes, embrace exponentials, and forget that the code even exists." He acknowledged this was suitable for "throwaway weekend projects." But by 2026, he refined the concept into "agentic engineering" -- "the new default is that you are not writing the code directly 99% of the time, you are orchestrating agents who do and acting as oversight." This is not casual; the word "engineering" is deliberate. It acknowledges that orchestrating AI-generated code requires expertise, taste, and discipline -- but that expertise is expressed in natural language, not syntax.

**Steel-manned response to Dijkstra:** Karpathy would argue that Dijkstra's critique targeted a world where machines could not parse natural language. That world no longer exists. The question is not whether natural language is *formally precise* but whether it is *functionally adequate* as an interface to code generation systems that can handle the translation. The answer is empirically yes, for an increasing range of tasks.

### 1.2 Altman: The Intelligence Age

Sam Altman's September 2024 essay "The Intelligence Age" articulates the broadest version of the natural-language-as-interface vision. His key arguments:

**Universal capability access.** Altman envisions a world where every person "can each have a personal AI team, full of virtual experts in different areas, working together to create almost anything we can imagine." This includes "the ability to create any kind of software someone can imagine." The implication is radical: programming ability should not be a scarce resource gatekept by formal language fluency.

**Historical continuity.** Altman frames AI as continuous with humanity's long history of building tools that amplify collective intelligence: "We benefit from the infrastructure of society being way smarter and more capable than any one of us." Natural language programming is not a break with this tradition but its culmination -- the interface between human intent and machine execution becoming as natural as spoken conversation.

**Infrastructure as precondition.** Altman warns that without democratized access, "AI will be a very limited resource that wars get fought over and that becomes mostly a tool for rich people." Natural language as a programming medium is therefore not just a technical choice but an equity imperative. If only those who can write Python can direct AI, the Intelligence Age reproduces the inequalities of the Information Age.

### 1.3 Amodei: The Marginal Returns to Intelligence

Dario Amodei's October 2024 essay "Machines of Loving Grace" offers a subtler argument. By "powerful AI," Amodei means a model "smarter than a Nobel Prize winner across most relevant fields including biology, programming, math, engineering, and writing" that "can be given tasks that take hours, days, or weeks to complete and then goes off and does those tasks autonomously."

The key philosophical move: Amodei argues we should think about "the marginal returns to intelligence" and identify "what the other factors are that are complementary to intelligence." Applied to programming, this suggests: if raw coding ability becomes commoditized through AI, then the *complementary* factors -- domain knowledge, taste, judgment about what to build, understanding of user needs -- become the scarce resources. These are best expressed in natural language, not formal notation.

Amodei's prediction that AI would write 90% of code within six months (March 2024) was premature, but the *direction* of the prediction -- that the ratio of human-written to AI-generated code would shift dramatically -- has proven correct. The abstraction layer is moving up whether we choose it or not.

### 1.4 Narayanan: AI as Normal Technology

Arvind Narayanan (Princeton, author of "AI Snake Oil," Nature's 10 best books of 2024) provides a crucial counterweight to both hype and dismissal. His framework "AI as Normal Technology" offers the most epistemically honest version of the pro-NL argument:

Narayanan distinguishes between "self-contained coding problems at which AI demonstrably excels" and "real-world software engineering in which its impact is hard to measure but appears to be modest." This is not a dismissal -- it is a scoping claim. The implication: natural language programming *works* for a well-defined and large class of problems (self-contained tasks, CRUD operations, data transformations, scripting), even if it does not (yet) replace full software engineering.

This is the most defensible version of the contrarian argument: not that NL replaces all programming, but that the *domain* where formal precision is strictly necessary is smaller than formalists claim.

### 1.5 Sutton: The Bitter Lesson Applied to Programming

Rich Sutton's 2019 essay "The Bitter Lesson" makes a general claim: in AI research, "general approaches that scale with available computational power tend to outperform ones based on domain-specific understanding." Two techniques scale: search and learning. Everything else -- hand-crafted rules, expert systems, domain-specific engineering -- eventually loses.

Applied to programming, the Bitter Lesson suggests that attempts to engineer precise specification languages, formal verification systems, and structured programming methodologies may be outcompeted by the brute-force approach: train massive language models on all available code, and let them learn the mapping from intent to implementation. This is exactly what has happened. GPT-4, Claude, and their successors did not learn programming through formal semantics; they learned it through statistical patterns over billions of tokens.

The Bitter Lesson's implication for the Dijkstra position is devastating: Dijkstra's approach -- designing precise formal languages for precise formal thought -- is the *epitome* of the approach that the Bitter Lesson predicts will lose. Not because it is wrong, but because it does not scale. Scaling computation with general methods does.

### 1.6 Sutskever: Compression as Understanding

Ilya Sutskever's key insight, articulated across multiple talks and particularly at NeurIPS 2024, is that language modeling can be understood as compression. A model that can predict the next token well must have, in some functional sense, "understood" the structure of the data.

Applied to code generation: an LLM that can translate English descriptions into working code has compressed the mapping between natural language and formal language. The compression is not perfect, but it is functional. Sutskever's framework suggests that the question is not "does the model *understand* the code?" (Searle's question) but "does the model *compress* the mapping well enough to be useful?" This reframes the entire debate from philosophy of mind to information theory.

At NeurIPS 2024, Sutskever also declared "Pre-Training as We Know It Will End," suggesting that future systems would possess genuine reasoning capabilities -- "grasping concepts, intentions, and causal relationships, enabling meaningful generalization." If this comes to pass, the Dijkstra objection (that machines cannot handle the ambiguity of natural language) may not just be worked around but *solved*.

---

## 2. Arguments from HCI/Design

### 2.1 Kay: End-User Programming Vision

Alan Kay's 1984 vision -- "We now want to edit our tools as we have previously edited our documents" -- is the intellectual ancestor of the entire NL programming movement. Kay's Dynabook concept imagined a personal computer where non-programmers could create and modify their own software. Smalltalk was designed to make programming accessible to children.

**The tension in Kay's position.** Kay himself expressed skepticism about natural language as a programming medium, noting that "languages that are a lot like English have a big problem because people's expectations about English seriously interfere, and English actually is not a good carrier of meaning." This is a genuine concern.

**But the pro-NL reading of Kay.** Kay's objection was about *direct* NL-to-execution. LLM-mediated NL programming is different: the human expresses intent in English, but the LLM translates to formal code, which is then executed. The expectations mismatch Kay worried about is handled by the LLM, not by the user. Geoffrey Litt (MIT, "Malleable Software in the Age of LLMs," 2023) explicitly frames LLMs as realizing Kay's vision: "LLMs represent a step change in tool support for end-user programming: the ability of normal people to fully harness the general power of computers without resorting to the complexity of normal programming." The bottleneck Kay identified -- turning "rough ideas into formal executable code" -- is precisely what LLMs address.

Litt's key distinction: LLMs do not just change *how fast* software gets written, but *when* it gets created (on-demand), *who* creates it (end-users), *what purpose* it serves (hyper-specific tasks), and *how it's distributed* (locally, not centrally). This is a structural transformation, not an incremental improvement.

### 2.2 Victor: Direct Manipulation and Goals-Based Programming

Bret Victor's "The Future of Programming" (2013) identified four shifts he expected by 2013 (delivered in the persona of a 1973 researcher):
1. Coding --> direct manipulation of data
2. Procedures --> goals and constraints
3. Text dump --> spatial representation
4. Sequential --> concurrent

**The NL programming connection.** Victor's second point -- programming via goals rather than procedures -- is essentially what natural language programming achieves. When a user tells an LLM "build me a dashboard that shows sales by region with a date filter," they are expressing a *goal*, not a procedure. The LLM handles the procedural translation.

**Would Victor see NL coding as progress?** Victor's deeper concern was that programming should be *learnable* and *visible* -- that the programmer should be able to see and manipulate the computational process directly. NL coding via chat is, by Victor's standards, a regression: it obscures the computational process behind a text interface. But NL coding *embedded in visual tools* (e.g., editing spreadsheet formulas by describing desired behavior, modifying UI components through natural language within a visual editor) aligns with Victor's vision of direct manipulation augmented by natural language. The key is that NL should not replace visual feedback but complement it.

### 2.3 Engelbart: Augmenting Human Intellect

Douglas Engelbart's 1962 framework "Augmenting Human Intellect" provides the strongest *systemic* argument for NL programming. Engelbart described the H-LAM/T system (Human using Language, Artifacts, Methodology, in which he is Trained). The four augmentation means are:
1. **Artifacts** -- physical tools (computers, displays)
2. **Language** -- symbol systems for communication and thought
3. **Methodology** -- procedures and strategies
4. **Training** -- the human's developed skills

Engelbart's Neo-Whorfian hypothesis: "Both the language used by a culture, and the capability for effective intellectual activity, are directly affected during their evolution by the means by which individuals control the external manipulation of symbols."

**Applied to NL programming:** If the language through which we manipulate symbols changes from Python to English-mediated-by-LLMs, our cognitive capabilities change correspondingly. NL programming does not just make programming easier -- it *restructures the cognitive task*. The programmer is no longer translating intent into syntax; they are articulating intent and evaluating outcomes. This is a different (and arguably higher-order) intellectual activity.

Engelbart's framework predicts that the tool (LLM) will co-evolve with the user's methodology and training. Karpathy's progression from "vibe coding" to "agentic engineering" is exactly this co-evolution: as the tool matured, the methodology became more disciplined, and the required skills shifted from "write prompts" to "orchestrate agents."

### 2.4 Winograd: From NL Parsing to Design

Terry Winograd's intellectual trajectory is uniquely instructive. In the late 1960s, he built SHRDLU -- a system that could accept natural language commands like "Find a block which is taller than the one you are holding and put it into the box" and execute them in a simulated blocks world. SHRDLU was celebrated as a triumph of NL understanding.

Then Winograd became disillusioned. Influenced by Hubert Dreyfus's critique of cognitivism and Fernando Flores's phenomenology, he concluded: "What I came to realize is that the success of the communication depends on the real intelligence on the part of the listener, and that there are many other ways of communicating with a computer that can be more effective, given that it doesn't have the intelligence."

**The LLM twist.** Winograd's objection was specifically about the *intelligence of the listener*. SHRDLU operated in a trivially simple blocks world; it lacked the broad world knowledge needed to interpret natural language in real contexts. LLMs have, at minimum, a vastly broader knowledge base. The question Winograd raised -- does the listener have sufficient intelligence? -- may now have a different answer. Not a perfect one (LLMs still lack grounded understanding in Winograd's sense), but a functionally adequate one for many programming tasks.

Winograd's shift toward design and HCI (culminating in "Understanding Computers and Cognition" with Flores, 1986) actually supports a nuanced NL programming position: the goal should not be perfect NL understanding but *effective human-computer interaction design* that leverages whatever NL capabilities exist.

### 2.5 Suchman: Situated Actions vs. Plans

Lucy Suchman's "Plans and Situated Actions" (1987) provides a powerful theoretical argument against the *spec-driven* model of programming that Dijkstra and formalists advocate.

**The planning model critique.** Suchman argued that the dominant AI/cognitive science view treats plans as "prerequisite to and prescribing action at whatever level of detail one might imagine." System designers build systems that identify an ideal plan, detect when users deviate from it, and correct them. Suchman showed this model fails: human action is "necessarily ad hoc responses to the actions of others and to the contingencies of particular situations."

**Applied to programming:** The waterfall model (write spec --> implement --> test) is the planning model applied to software. Suchman's critique predicts exactly what the software industry discovered empirically: waterfall fails because specifications cannot anticipate situated contingencies. Agile, iterative development succeeded because it acknowledged the situated nature of software creation.

NL-mediated programming with LLMs is *radically situated*: the developer converses with the AI, evaluates intermediate outputs, adjusts direction based on what emerges, and iteratively refines. This is closer to Suchman's "situated actions" than to the planning model. The spec is not written in advance and then implemented; it *emerges* through interaction.

Suchman's framework suggests that the formalist critique of NL programming (it's too imprecise for plans) misidentifies the problem. Programming was never well-served by the planning model. NL-mediated programming may be better *because* it abandons the pretense of complete upfront specification.

### 2.6 Nardi: Spreadsheets as Existence Proof

Bonnie Nardi's "A Small Matter of Programming" (1993) documented an empirical finding that challenges the formalist position: spreadsheets are the most successful end-user programming paradigm in history. Hundreds of millions of people program in spreadsheets without knowing they are programming.

**The key insight.** Spreadsheets succeed not because they are formally precise (spreadsheet formulas are notoriously error-prone) but because they embed computation in a *task-specific context* that makes the programming model legible to domain experts. The user sees data, manipulates it directly, and gets immediate feedback.

**Applied to NL programming.** Nardi's work suggests that the success of a programming medium depends less on formal precision and more on: (a) task-specificity, (b) immediacy of feedback, and (c) alignment with the user's mental model. NL programming with LLMs can provide all three: the user describes a task in domain-appropriate language, gets immediate code output they can test, and iterates in terms they understand.

If spreadsheets -- imprecise, error-prone, with no formal verification -- are the most successful programming paradigm by user count, then formal precision is *not* the primary determinant of programming success. Accessibility and task-alignment are.

---

## 3. Arguments from Cognitive Science

### 3.1 Lakoff: Embodied Cognition and Programming

George Lakoff's central thesis (with Mark Johnson, in "Metaphors We Live By" and "Philosophy in the Flesh"): abstract thought is grounded in embodied metaphor. "Our brains take their input from the rest of our bodies. What our bodies are like and how they function in the world thus structures the very concepts we can use to think."

**The anti-Dijkstra implication.** Dijkstra and the formalist tradition treat programming as an exercise in *disembodied formal reasoning* -- manipulating abstract symbols according to logical rules. Lakoff's framework suggests this is cognitively unrealistic. Humans do not think in pure formal symbols; they think in metaphors grounded in physical experience. We speak of "stacks" and "queues" and "pointers" and "branches" -- all metaphors from physical space and action.

Natural language preserves these embodied metaphors. Formal notation strips them away. If Lakoff is right that abstract reasoning is *constitutively* metaphorical, then forcing programmers to think in pure formal notation imposes an unnecessary cognitive tax. NL programming allows programmers to think and communicate in the embodied metaphorical mode that is actually how human cognition works.

**The Chomsky contrast.** Lakoff explicitly rejected the Chomskyan view of language as "a string of meaningless abstract symbols" governed by formal grammar -- a view that parallels Dijkstra's conception of programming languages. If language is not fundamentally a formal symbol system (as Lakoff argues), then the insistence that programming must be conducted in formal symbol systems rests on a mistaken analogy between human language and formal language.

### 3.2 Clark: Extended Mind and Human-AI Programming

Andy Clark's extended mind thesis (with David Chalmers, 1998; expanded in "Natural-Born Cyborgs," 2003) argues that cognition does not happen only inside the skull. When a person uses a notebook to remember things, the notebook is *part of their cognitive system*. The mind extends into the tools.

**Applied to LLM-assisted programming.** Under Clark's framework, a developer working with an LLM is not "outsourcing" cognition to a tool; they are *extending* their cognitive system. The human-LLM system is a cognitive unit with capabilities that neither component has alone. The human provides intent, judgment, and domain knowledge; the LLM provides code generation, pattern recall, and syntax fluency.

This reframes the question entirely. The Dijkstra position asks: "Can natural language precisely specify a program?" Clark's framework asks: "Can the human-LLM cognitive system effectively produce programs?" These are different questions with potentially different answers.

Clark argues that humans are "natural-born cyborgs -- beings whose cognitive capacities have always been constitutively shaped by the cognitive technologies available to them." From this perspective, NL-mediated programming is not a degradation of programming rigor; it is the latest instance of humans incorporating cognitive technologies into their extended minds.

### 3.3 Hutchins: Distributed Cognition in Programming

Edwin Hutchins' distributed cognition framework (developed through his ethnographic study of naval navigation, published as "Cognition in the Wild," 1995) takes the unit of analysis to be "a collection of individuals and artifacts and their relations to each other in a particular work practice."

**The navigation analogy.** In Hutchins' study of the USS Palau, no single crew member "navigated" the ship. Navigation was an emergent property of the crew + instruments + charts + procedures system. Information was transformed across multiple representations by different team members.

**Applied to human-LLM programming.** The developer + LLM + IDE + tests + version control system constitutes a distributed cognitive system. The human developer does not need to hold the entire program in their head (formal specification) because cognition is distributed across the system. The human expresses intent in NL; the LLM transforms it into code; tests verify correctness; the IDE provides visual feedback; version control tracks history.

Hutchins' framework suggests that requiring the human to specify everything formally is like requiring one crew member to do all of navigation alone. It is a misunderstanding of how effective cognitive work actually happens in practice. The *system* achieves precision, even if no single component (including the human's NL specification) is precise on its own.

### 3.4 Vygotsky: AI as Scaffolding

Lev Vygotsky's Zone of Proximal Development (ZPD) -- the gap between what a learner can do independently and what they can achieve with guidance from a More Knowledgeable Other (MKO) -- maps directly onto AI-assisted programming.

**The ZPD argument.** For a novice programmer, writing a web scraper from scratch is outside their ZPD. But with an LLM as MKO, they can describe what they want in natural language, receive working code, study it, modify it, and gradually internalize the patterns. The NL interface serves as scaffolding that is "most effective when the support is matched to the needs of the learner."

**The deeper implication.** Vygotsky argued that all higher mental functions originate in social interaction and are internalized over time. If AI-mediated NL programming becomes a standard mode of learning and practicing programming, then the cognitive skills it develops *are* programming skills -- just different ones from those developed through manual code writing. The formalist objection ("NL programming doesn't teach real programming") assumes a fixed definition of "real programming" that Vygotsky's framework rejects.

MIT Open Learning has explicitly connected Vygotsky to AI: "When using generative AI in teaching, learning scenarios should simulate scaffolding interactions in the zone of proximal development where the students and technology collaboratively tackle tasks and problems."

### 3.5 Bruner: Multiple Modes of Representation

Jerome Bruner's three modes of representation -- enactive (action-based), iconic (image-based), and symbolic (language-based) -- suggest that effective learning and problem-solving require engaging multiple representational modes.

**Applied to programming paradigms.** Traditional text-based programming operates almost exclusively in the symbolic mode. Victor's direct manipulation vision adds the iconic and enactive modes. NL programming adds a *different layer* of the symbolic mode -- one that uses natural language symbols rather than formal language symbols.

Bruner's framework suggests that no single representational mode is sufficient. The ideal programming environment would combine: NL for expressing intent (natural symbolic), visual tools for seeing data and structure (iconic), direct manipulation for interacting with running programs (enactive), and formal code for precision (formal symbolic). NL programming is not a replacement for formal code but an additional representational layer that makes the overall system more cognitively rich.

Bruner's spiral curriculum concept also applies: a learner might start with NL programming (accessible), gradually see the generated code (formal symbolic), eventually modify code directly, and ultimately write code from scratch -- revisiting the same concepts at increasing levels of formality.

---

## 4. Arguments from Philosophy of Language

### 4.1 Wittgenstein: Language Games and Meaning as Use

Ludwig Wittgenstein's later philosophy (Philosophical Investigations, 1953) provides perhaps the most powerful philosophical argument against the Dijkstra position.

**The early Wittgenstein supported Dijkstra.** The Tractatus Logico-Philosophicus (1921) argued that language pictures facts through logical form, and that the limits of language are the limits of the world. This view -- language as a formal logical structure -- aligns perfectly with Dijkstra's insistence on formal notation.

**The later Wittgenstein undermines Dijkstra.** Wittgenstein repudiated his early work. In the Investigations, he argued that meaning is not determined by formal structure but by *use in context* -- what he called "language games." A language game is a form of life in which words acquire meaning through their role in a social practice. "Understanding" in these games "comes down to simply behaving correctly and as intended and expected in the relevant situation."

**Applied to NL programming.** A prompt to an LLM is a move in a language game. Its meaning is not fixed by formal semantics but by the *practice* of prompting -- the conventions, expectations, and iterative refinements that constitute the human-LLM interaction. When a developer writes "create a REST API for user authentication with JWT tokens," this has determinate meaning not because each word has a fixed formal definition but because of the shared context (web development practices, JWT standards, REST conventions) and the iterative feedback loop.

As one analysis puts it: "Wittgenstein gives you a more useful habit: treat language as a set of games, and treat yourself as the game designer. When you stop being angry at the model for being 'stupid' and start asking whether you explained the rules and provided the grounding, the whole problem becomes more systematic."

The Dijkstra position assumes that meaning must be formally specified to be precise. Wittgenstein showed that meaning can be practically determinate without being formally specified -- through shared forms of life. NL programming with LLMs creates a new form of life with its own language games, and these games can be effective even without formal specification.

### 4.2 Austin: Prompts as Speech Acts

J.L. Austin's speech act theory ("How to Do Things with Words," 1962) distinguished between:
- **Locutionary acts**: producing a meaningful expression
- **Illocutionary acts**: what is done *in* saying something (asserting, requesting, promising)
- **Perlocutionary acts**: the effect on the audience

**A prompt is a performative utterance.** When a developer writes "Build a login page with email and password fields, validation, and a submit button," this is not a constative statement (true or false) but a performative one -- an act of *commanding* or *requesting*. Austin's key insight: the effectiveness of a performative depends not on formal precision but on *appropriate circumstances* and *shared conventions* (what Austin called "felicity conditions").

**Felicity conditions for prompts.** A prompt "works" (is felicitous) when:
1. The LLM has the capability to fulfill the request
2. The context is sufficiently specified (through conversation history, project files, etc.)
3. Both parties share conventions about what the terms mean
4. The human intends the prompt sincerely and will evaluate the result

These are the same conditions that make any directive speech act work -- from "pass the salt" to "draft a contract." The formalist objection that NL is too imprecise is, in Austin's terms, a category error: it evaluates performative utterances by constative criteria. Prompts should not be evaluated for truth or formal precision but for *felicity* -- whether they successfully bring about the intended action.

### 4.3 Searle: The Chinese Room Revisited

John Searle's Chinese Room argument (1980) -- that a system can manipulate symbols correctly without understanding them -- is often cited against LLM-based programming. The argument: the LLM does not "understand" the code it generates any more than a person following symbol-manipulation rules "understands" Chinese.

**The "double Chinese Room" problem.** Mark Marino (2024) identified a provocative extension: when an LLM generates code, there are *two* Chinese Rooms -- the LLM producing code without understanding, and the computer/compiler processing it without understanding. The human prompter "may be just as in the dark as the person in the room producing code without comprehension."

**The pragmatic counter-argument.** But Searle's argument, even if philosophically sound, may be practically irrelevant for programming. Consider: a compiler also does not "understand" code. A CPU does not "understand" machine instructions. The entire computational stack operates without understanding. If we do not require understanding from compilers and CPUs, why require it from the NL-to-code translation layer?

The relevant question is not "does the LLM understand?" but "does the *system* (human + LLM + tests + review) produce correct programs?" This is an empirical question, not a philosophical one. And the empirical evidence, while mixed, suggests the answer is increasingly "yes, for a growing range of tasks."

**The systems reply strengthened.** The classical "systems reply" to Searle (the individual does not understand, but the system does) gains new force in the age of LLMs. The human-LLM-IDE-test system has properties -- including the ability to produce working software from natural language specifications -- that no component has alone. Whether this constitutes "understanding" is a philosophical question; whether it constitutes "effective programming" is a practical one.

---

## 5. Specific Rebuttals to Dijkstra/Gonzalez

### 5.1 "LLMs Change the Parsing Problem"

**Dijkstra's actual argument.** Dijkstra argued against NL programming in EWD 667 (1978) because: (a) natural language is ambiguous, (b) machines cannot reliably parse it, and (c) the attempt to make them do so encourages sloppy thinking.

**What has changed.** Points (a) and (c) remain debatable. But point (b) -- machines cannot reliably parse natural language -- is empirically false as of 2023. LLMs parse natural language with remarkable (if imperfect) reliability. This changes the argument fundamentally.

As Peter Szalontay argues: "What Dijkstra did not anticipate is that we will write software *with* words rather than the program *being* words." The distinction is crucial. Dijkstra imagined natural language as *source code* -- directly executed. The reality is natural language as *specification* -- translated by an LLM into formal code. The formal code still exists; the question is just who (or what) writes it.

Marc Brooker (Amazon VP/Distinguished Engineer) makes the strongest version of this rebuttal: "Almost all programs are already specified in natural language. And always have been." Requirements documents, user stories, Slack messages between developers -- these are all natural language specifications that humans translate into code. LLMs automate this translation. They do not change *what* is specified; they change *who* does the translation.

### 5.2 "The Abstraction Stack Always Moves Up"

The historical progression of programming abstractions:

| Era | Abstraction | What the programmer specifies | What is automated |
|-----|------------|-------------------------------|-------------------|
| 1950s | Machine code | Every bit | Nothing |
| 1960s | Assembly | Instructions + registers | Bit patterns |
| 1970s | C | Algorithms + data structures | Register allocation, instruction selection |
| 1990s | Java/Python | Objects + behavior | Memory management, platform details |
| 2020s | NL + LLMs | Intent + constraints | Implementation, syntax, boilerplate |

Each transition was resisted by practitioners of the lower level. Assembly programmers objected that compilers produced inefficient code. C programmers objected that garbage collection was wasteful. In each case, the higher abstraction won -- not because it was more precise, but because it was more productive, and hardware improvements made the efficiency cost acceptable.

**The argument:** The NL-to-code transition follows the same pattern. It sacrifices some precision and efficiency for a massive productivity gain and accessibility increase. The Dijkstra position is the 2020s equivalent of arguing that real programmers should write assembly -- technically defensible but historically doomed.

**The counter-counter:** Critics argue that previous transitions (assembly to C, C to Python) stayed within formal language. The jump to NL crosses a category boundary. But this assumes the relevant category is "formal vs. informal" rather than "lower vs. higher abstraction." The historical pattern suggests the latter is what matters.

### 5.3 "Good Enough Beats Perfect"

**The scope argument.** Not all software requires formal correctness. The vast majority of software written in the world is:
- CRUD applications (create, read, update, delete)
- Internal business tools
- Data pipelines and ETL scripts
- Prototypes and MVPs
- Personal automation scripts
- Marketing websites

For these applications, "good enough" is not a compromise -- it is the correct engineering standard. Over-engineering a CRUD app with formal verification is a misallocation of resources.

Dijkstra's standards are appropriate for: flight control systems, medical devices, financial settlement systems, cryptographic implementations, nuclear reactor controls. These represent a tiny fraction of all software written.

**The economic argument.** If NL programming allows 10x more software to be created at 80% of the quality of hand-written code, the net value created is enormous. The Dijkstra position optimizes for the quality of *individual programs*; the NL position optimizes for the *total value of all software produced*.

### 5.4 "The Spec IS the Program, and That's Fine"

Gonzalez's 2026 article argues that specifications converge on code -- that as you make a spec precise enough to be unambiguous, it becomes code. The contrarian response: *yes, and LLMs handle that convergence*.

**Don Syme's argument** (creator of F#, essay "On Natural Language Programming," 2025): Syme challenges what he calls "The Symbolic Supremacy" -- the belief that programs must be "expressed in symbolic notation following logical mathematical rules." He proposes replacing it with "The Clarity Supremacy" -- prioritizing clarity of intent across all paradigms.

Syme redefines programming: "a program is instructions given to a machine to achieve results." By this definition, a natural language prompt that produces a working program *is* a program. The spec *is* the program -- not because it has converged on formal code, but because the LLM handles the translation.

**The key move:** If the human's job is to write the spec, and the spec is inherently in natural language (because it originates in human intent), then the only question is whether the NL-to-code translation is reliable enough. This is an engineering problem, not a philosophical one. And it is a problem that is being solved incrementally, not one that requires a theoretical breakthrough.

### 5.5 "Conversational Refinement Solves Ambiguity"

**The static specification problem.** Dijkstra's critique assumes a *static* natural language specification -- a document that must be unambiguously interpretable without further interaction. This is indeed hopeless, as any requirements engineer knows.

**The conversational solution.** But NL programming with LLMs is not static -- it is *interactive*. As Brooker argues: "the trips around the loop are fundamental to the success of the whole enterprise." The developer says something ambiguous; the LLM generates code based on its best interpretation; the developer evaluates the result; if it is wrong, they clarify; the LLM regenerates. Each iteration reduces ambiguity.

Recent research (2024-2025) confirms this empirically:
- Interactive agents that systematically narrow ambiguities "through a structured series of clarification questions and alternative solution proposals" (Interactive Agents to Overcome Ambiguity in Software Engineering, 2025)
- Programmers naturally "adjust or rephrase their prompts based on initial responses" with LLMs (Conversational AI as a Coding Assistant, 2025)
- MPaTHS framework uses "back-and-forth clarifications to resolve ambiguities and specification holes"

**The information-theoretic reframe.** In Shannon's framework, ambiguity is not a binary property but a quantitative one. Each conversational turn transfers information from human to machine, reducing the entropy of the specification. A formal specification transfers all information in one shot (high bandwidth, high cognitive cost). A conversational specification transfers information incrementally (lower bandwidth per turn, but lower cognitive cost and higher error-correction capability). The total information transferred can be equivalent.

### 5.6 "Programming Was Never Just About Precision"

**The communication argument.** Abelson and Sussman's famous statement in SICP: "Programs must be written for people to read, and only incidentally for machines to execute." Knuth's literate programming: programs as documents written primarily for human understanding.

If programming is primarily about *human communication* -- conveying intent, design, and reasoning to other developers (including your future self) -- then natural language is not a weakness but a strength. Code review, documentation, commit messages, design discussions -- all the *communication* surrounding code is already in natural language. NL-mediated programming collapses the gap between the communication layer and the implementation layer.

**John Carmack's framing.** The legendary programmer stated: "'Coding' was never the source of value, and people shouldn't get overly attached to it. Problem solving is the core skill." If the value is in problem-solving (formulating the right problem, decomposing it, evaluating solutions) rather than in code-writing (translating solutions into syntax), then NL programming preserves the valuable part and automates the mechanical part.

### 5.7 "The Democratization Argument"

**The numbers.** Approximately 5 billion people speak a language that LLMs can process fluently. Approximately 27 million people write code professionally. The ratio is roughly 185:1.

**The bottleneck.** Every organization has more ideas for software than programmers to build it. Every domain expert (doctor, teacher, small business owner, researcher) has workflows that could be automated but lacks the programming skill to automate them. Every developing country has talented people whose potential is limited by lack of access to programming education.

NL programming does not just make existing programmers faster; it creates *new* programmers -- people who can direct computers to solve problems using the language they already speak. This is not a marginal improvement; it is a potential 100x expansion of the global programming workforce.

**The equity argument.** Programming languages are overwhelmingly English-based in their keywords and documentation. But natural language programming through LLMs can work in any language the model supports -- including languages spoken by billions of people who are currently locked out of programming. A farmer in Tamil Nadu can potentially describe an irrigation scheduling algorithm in Tamil and have it implemented. This is not a theoretical possibility; it is an emerging reality.

**The historical precedent.** Literacy was once restricted to a priestly class who mastered the formal symbol systems of their culture. The invention of vernacular writing (and later, universal education) did not "degrade" literacy -- it transformed civilization. The formalist objection to NL programming echoes historical objections to vernacular translation of the Bible, universal public education, and the democratization of every other knowledge practice.

---

## 6. Synthesis: The Strongest Case Against Dijkstra

The strongest contrarian case combines multiple threads:

1. **Dijkstra solved a different problem.** His argument addressed a world where machines could not parse NL. That constraint no longer holds. (Szalontay, Brooker)

2. **Programming is communication, not just computation.** If code is primarily for humans to read (Abelson/Sussman, Knuth), then NL is a feature, not a bug. (Carmack, Syme)

3. **The planning model is wrong.** Software development is situated action (Suchman), not formal planning. NL-mediated iterative development is better suited to this reality.

4. **Cognition is distributed and extended.** The human+LLM system achieves what neither can alone (Clark, Hutchins). Formal precision at the human-machine interface is unnecessary if the system as a whole produces correct outputs.

5. **Meaning is use, not formal structure.** Wittgenstein's later philosophy shows that practical determinacy of meaning does not require formal specification. Prompts are language games, not logical propositions.

6. **The abstraction stack has always moved up.** Every previous generation of programmers resisted the next abstraction layer. Every previous generation was wrong. (Historical pattern)

7. **Good enough is good enough, most of the time.** Formal correctness matters for 1% of software. Accessibility and productivity matter for 100%. (Narayanan's scoping, Nardi's spreadsheet precedent)

8. **The bitter lesson predicts this.** General methods that scale (LLMs) outperform domain-specific engineered solutions (formal specification languages). (Sutton)

The case is not that Dijkstra was wrong about everything. He was right that sloppy thinking produces bad software. He was right that formal rigor has immense value for critical systems. He was right that natural language is ambiguous. But he was wrong that these truths imply natural language cannot be a productive programming medium. The LLM changes the game -- not by making natural language precise, but by making the translation from imprecise natural language to precise formal code sufficiently reliable for a vast range of practical purposes.

---

## 7. Source Index

### CS/AI Leaders
- Karpathy, A. "The hottest new programming language is English." Twitter/X, January 24, 2023. https://x.com/karpathy/status/1617979122625712128
- Karpathy, A. "Software 2.0." Medium, November 11, 2017. https://karpathy.medium.com/software-2-0-a64152b37c35
- Karpathy, A. Vibe coding concept (February 2025) and agentic engineering evolution. https://en.wikipedia.org/wiki/Vibe_coding
- Altman, S. "The Intelligence Age." September 23, 2024. https://ia.samaltman.com/
- Amodei, D. "Machines of Loving Grace." October 2024. https://www.darioamodei.com/essay/machines-of-loving-grace
- Narayanan, A. "AI Snake Oil." Princeton University Press, 2024. https://www.cs.princeton.edu/~arvindn/
- Narayanan, A. "AI as Normal Technology." World Bank, 2025. https://thedocs.worldbank.org/en/doc/7bcefa22eb96683201bf2d93253cf71c-0050022025/original/Paper-1-Narayanan-ABCDE-AI-Normal-Technology.pdf
- Sutton, R. "The Bitter Lesson." March 13, 2019. https://en.wikipedia.org/wiki/Bitter_lesson
- Sutskever, I. "Pre-Training as We Know It Will End." NeurIPS 2024. https://news.ycombinator.com/item?id=42413677

### HCI/Design
- Kay, A. End-user programming vision (1984). https://tinlizzie.org/IA/index.php/End-User_Programming_by_Alan_Kay_(1991)
- Victor, B. "The Future of Programming." 2013. http://glamour-and-discourse.blogspot.com/p/the-future-of-programming-bret-victor.html
- Engelbart, D. "Augmenting Human Intellect: A Conceptual Framework." 1962. https://dougengelbart.org/pubs/augment-3906.html
- Winograd, T. SHRDLU and subsequent evolution. https://en.wikipedia.org/wiki/Terry_Winograd
- Winograd, T. and Flores, F. "Understanding Computers and Cognition." 1986.
- Suchman, L. "Plans and Situated Actions." Cambridge University Press, 1987.
- Nardi, B. "A Small Matter of Programming." MIT Press, 1993. https://mitpress.mit.edu/9780262140539/a-small-matter-of-programming/
- Litt, G. "Malleable Software in the Age of LLMs." March 2023. https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html

### Cognitive Science
- Lakoff, G. and Johnson, M. "Metaphors We Live By." 1980; "Philosophy in the Flesh." 1999. https://www.edge.org/conversation/george_lakoff-philosophy-in-the-flesh
- Clark, A. and Chalmers, D. "The Extended Mind." 1998; Clark, A. "Natural-Born Cyborgs." 2003. https://global.oup.com/academic/product/natural-born-cyborgs-9780195177510
- Hutchins, E. "Cognition in the Wild." MIT Press, 1995. https://en.wikipedia.org/wiki/Distributed_cognition
- Vygotsky, L. Zone of Proximal Development. Applied to AI: https://medium.com/open-learning/vygotsky-meets-chatgpt-f4a6a0460913
- Bruner, J. Three Modes of Representation. https://www.simplypsychology.org/bruner.html

### Philosophy of Language
- Wittgenstein, L. "Philosophical Investigations." 1953. Applied to LLMs: https://www.strv.com/blog/language-games-and-llms-what-wittgenstein-can-teach-ai-engineers
- Austin, J.L. "How to Do Things with Words." 1962. https://plato.stanford.edu/entries/speech-acts/
- Searle, J. "Minds, Brains, and Programs." 1980. Applied to LLMs: https://www.tandfonline.com/doi/full/10.1080/0020174X.2024.2446241

### Contemporary Rebuttals to Dijkstra
- Brooker, M. "On the success of 'natural language programming'." December 2025. https://brooker.co.za/blog/2025/12/16/natural-language.html
- Syme, D. "On Natural Language Programming." August 2025. https://dsyme.net/2025/08/27/on-natural-language-programming/
- Szalontay, P. "LLMs, programming and re Dijkstra's On the foolishness of 'natural language programming'." Medium, 2024. https://medium.com/@Szypetike/llms-programming-and-re-dijkstras-on-the-foolishness-of-natural-language-programming-1978-831729c4b968
- Marino, M. "Back to the Chinese Room: Programming with ChatGPT." 2024. https://markcmarino.medium.com/back-to-the-chinese-room-programming-with-chatgpt-658aed0a200b
- Carmack, J. Twitter/X, February 2024. https://x.com/ID_AA_Carmack/status/1762110222321975442

### Additional
- Abelson, H. and Sussman, G. "Structure and Interpretation of Computer Programs." MIT Press, 1984. https://www.goodreads.com/quotes/9168-programs-must-be-written-for-people-to-read-and-only
- Dijkstra, E.W. "On the foolishness of 'natural language programming.'" EWD 667, 1978. https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
