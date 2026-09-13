# AI WasteWise - AI Workflow

## System Workflow

```text
                    AI WASTEWISE
                         |
                         v
                  +-------------+
                  | USER INPUT  |
                  +------+------+
                         |
              +----------+----------+
              |                     |
              v                     v
        TEXT INPUT             IMAGE INPUT
              |                     |
              +----------+----------+
                         |
                         v
                  +-------------+
                  | NODE.JS API |
                  |   BACKEND   |
                  +------+------+
                         |
                         v
                  +-------------+
                  |  GEMINI AI  |
                  |             |
                  | Classification
                  | Recommendation
                  +------+------+
                         |
                         v
                  +-------------+
                  | AI RESULT   |
                  |             |
                  | Category    |
                  | Waste Type  |
                  | Disposal    |
                  | Confidence  |
                  +------+------+
                         |
                         v
                  +-------------+
                  | SUSTAINABILITY |
                  | TIP            |
                  +------+---------+
                         |
                         v
                    USER RESULT