## **🧪 Subconscious.ai Case Study \- SWOT Prompt Explorer**

**Live Brief:**

Build a simple live web app that lets us query an LLM to generate SWOT-style insights across different customer segments — and explore those results with a clear, elegant UI.

---

### **🎯 What You’re Building**

A **live** internal tool that lets users:

1. Choose a **Product**  (e.g. Electric Cars, Coffee)

2. Choose a **Business Objective**  (e.g. Increase Awareness, Increase Consideration, Increase Sales )

3. Choose a **market segment** (e.g. Gen Z Creators, Urban Parents, etc.)

4. Automatically run a predefined set of **LLM prompts** for that segment

5. Display responses (Strengths, Weaknesses, Opportunities, Threats, etc.) in a clean, browsable UI — think early **Conjoint.ly** meets **Notion**  
---

### **🧠 Prompt Types (Run these for each segment)**

Use OpenAI or Claude Code to generate responses for each category:

* **Marketing OKRs**

   “What are 3 measurable marketing OKRs to grow usage in the \[segment\]?”

* **Strengths**

   “What product strengths matter most to a \[segment\]?”

* **Weaknesses**

   “What would the \[segment\] be concerned about or dislike?”

* **Opportunities**

   “What product or brand opportunities can we unlock by targeting the \[segment\]?”

* **Threats**

   “What risks might prevent the \[segment\] from adopting or staying loyal?”

* **Market Positioning**

   “How should we position the product to resonate with the \[segment\]?”

* **Buyer Persona**

   “Write a sample persona for a typical \[segment\] customer.”

* **Investment Opportunities**

   “Why is this segment strategically valuable from a growth/investment perspective?”

* **Channels & Distribution**

   “How should we reach and activate the \[segment\]?”

---

### **🧬 Segments (Pick 3–5)**

Examples:

* Gen Z Creators

* Urban Climate Advocates

* Cost-Sensitive SMB Owners

* Retired DIYers

* Enterprise IT Leaders

---

### **🖥️ UX/UI Requirements**

* Sidebar or tab-based UI for selecting segments and prompt categories

* Clear content cards for LLM responses

* Minimalist, smooth layout — fast and usable

* Bonus: comparison mode, confidence scores, response saving

**Vibe:** Clean, fast, decision-making tool — not a playground.

---

### **🚀 Deployment**

* **Must be deployed live** — no GitHub repo submissions

* OK to use [Claude Code](https://claude.ai/tools/code) or other AI LLM tools

* Recommend forking either of these starter templates (or your own):

  * [ixartz/saa.s-boilerplate](https://github.com/ixartz/SaaS-Boilerplate)

  * [suyalcinkaya/onur.dev](https://github.com/suyalcinkaya/onur.dev)

* **Visualization Libraries to consider (or BYO):**

  * [https://github.com/vasturiano/react-force-graph](https://github.com/vasturiano/react-force-graph) (3-d graph visualization of users) or [https://github.com/xyflow/xyflow](https://github.com/xyflow/xyflow)

  * @shadcn/ui \+ [react-markdown](https://github.com/remarkjs/react-markdown) or mdx (Combine with react-icons or lucide-react to visually cue SWOT types?)

  * For visualizing individuals within personas consider https://github.com/ag-grid/react-data-grid

  * [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) \+ [framer-motion](https://github.com/motiondivision/motion/blob/main/packages/framer-motion/README.md) (Build a draggable or animated grid of personas / insights per segment?

---

### **✅ How We’ll Evaluate**

* Clarity and UX of the interface  
* Output readability and structure  
* Visual quality — spacing, motion, hierarchy  
* Speed of iteration and polish