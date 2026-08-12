# 第一组任务一：IDBLOOM 网站 Demo 开发指令

## 结论

做网站 **可行，而且比临时搭 Coze Bot 更适合录屏展示**。

这次任务的目标不是做一个真正上线的完整 AI 产品，而是做一个能在 40-60 秒内清楚展示 IDBLOOM 核心逻辑的可录屏 Demo：

> 用户输入一段家庭日常 -> 网站模拟 AI 分析 -> 生成能力标签 -> 生成平台文案 -> 生成服务建议 -> 模拟订单提醒

为了稳定和节省时间，建议做一个 **静态网页 Demo**，不要接真实 AI API。现场评委不会检查后端，重点是看懂概念、流程和商业价值。

---

## 可以直接发给另一个 Codex 的 Prompt

请你在当前项目中做一个用于 BPA 展示录屏的 IDBLOOM 网站 Demo。

### 背景

我们参加 BPA 全球赛，主题是：

**Labor Identity: How Digital Technology Turns Personal Uniqueness into Economic Value**

我们的方案叫 **IDBLOOM**，目标用户是家庭主妇。产品帮助家庭主妇把日常生活中的隐性能力转化为可被市场识别的职业身份和收入机会。

IDBLOOM 的核心概念是：

**ID = Inner Identity + Demand Delivery**

- **Inner Identity**：向内发现身份。AI 从家庭主妇的日常记录中识别技能、审美、经验和个人价值。
- **Demand Delivery**：向外递送需求。AI 把这些能力包装成服务、内容或商品，并匹配到小红书、TikTok、淘宝、Amazon、同城服务和社区订单。

### Demo 目标

做一个可录屏的网站，流程要非常直观：

1. 用户在输入框输入一句家庭日常。
2. 点击按钮：`Bloom My Identity`。
3. 页面出现 AI 分析加载动效。
4. 生成以下内容：
   - 隐性能力标签
   - Identity Passport 身份资产履历
   - 小红书 / TikTok 文案
   - 可售卖服务建议
   - 模拟订单或客户兴趣提醒
5. 页面最后显示一句收尾：
   **From hidden labor to recognized opportunity.**

### 技术要求

优先做最简单稳定的版本：

- 静态网页即可。
- 可以用纯 HTML / CSS / JavaScript。
- 如果项目已有 React / Vite，就沿用现有技术栈。
- 不要新增不必要依赖。
- 不要接真实 AI API。
- 用前端 mock 规则生成内容即可，保证录屏时稳定。
- 页面必须可以本地运行或直接打开。

### 页面风格

视觉关键词：

- 温暖
- 干净
- 有轻微科技感
- 像一个真实 AI 产品 Demo
- 不要做成营销落地页

建议配色：

- 白色或浅背景
- 柔和绿色 / 青色作为主色
- 少量紫色或蓝色做科技感点缀

页面第一屏应该直接是产品体验，不要大段介绍。

### 页面结构

建议只有一个主页面，分为左右两区：

左侧：输入和用户故事

- Logo：IDBLOOM
- Subtitle：Inner Identity + Demand Delivery
- 用户输入框
- 示例输入按钮
- 主按钮：Bloom My Identity

右侧：AI 输出结果

输出内容分成 4 个区块：

1. **Inner Identity**
   - 技能标签
   - 职业化翻译
   - 隐性能力解释

2. **Identity Passport**
   - 用户身份标题，例如：Family Space Optimizer
   - 核心技能
   - 证据描述
   - 可用时间

3. **Demand Delivery**
   - 推荐平台
   - 服务建议
   - 定价建议

4. **Market Output**
   - 小红书文案
   - TikTok 短视频脚本
   - 模拟订单提醒

### 推荐默认输入

默认输入框可以预填：

```text
Today I used 6 storage boxes to reorganize my kitchen. My children can finally find breakfast by themselves.
```

### 推荐生成结果

用户点击按钮后，可以固定生成下面这组内容。

#### Skills Detected

- Space Planning
- Storage System Design
- Child Independence Training
- Family Workflow Optimization

#### Identity Passport

```text
Mrs. Chan
Family Space Optimizer

Hidden expertise:
- Small-space kitchen organization
- Child-friendly storage design
- Daily family routine optimization

Evidence:
Before/after kitchen reset completed with 6 storage boxes.

Available time:
Saturday 2:00 PM - 5:00 PM
```

#### Demand Delivery

```text
Recommended offer:
2-hour Small Kitchen Reset Session

Target customers:
Busy parents in small apartments

Suggested price:
HKD 350-500 per session

Best platforms:
Xiaohongshu, TikTok, local parent groups, community centers
```

#### 小红书文案

```text
香港小厨房收纳改造：6 个盒子让孩子自己找到早餐

今天我把早餐食材、烘焙用品和调味品重新分区。
整理后，孩子可以自己拿早餐，早上的混乱少了很多。
如果你家也是小厨房，可以先从“孩子能不能自己找到东西”这个标准开始整理。
```

#### TikTok Script

```text
Before: A busy kitchen where no one can find breakfast.
After: Six boxes, clear zones, and children choosing breakfast by themselves.
Tip: Good storage is not about hiding things. It is about making daily life easier.
```

#### 模拟订单提醒

```text
3 people saved your post.
1 neighbor requested a weekend kitchen reset trial.
Estimated income opportunity: HKD 450.
```

### 交互动效

做最少但有效的动效：

- 点击按钮后显示 1-2 秒 loading。
- 输出卡片依次出现。
- 技能标签可以逐个浮现。
- 模拟订单提醒最后弹出，适合录屏收尾。

### 录屏剧本

网站完成后，录屏按这个顺序：

1. 打开网站，展示 IDBLOOM 标题。
2. 镜头停在默认输入：
   “Today I used 6 storage boxes...”
3. 点击 `Bloom My Identity`。
4. 等待 AI 分析动画。
5. 依次展示 Skills Detected、Identity Passport、Demand Delivery。
6. 最后停在模拟订单提醒：
   “1 neighbor requested a weekend kitchen reset trial.”

总时长控制在 40-60 秒。

### 验收标准

完成后请确保：

- 页面能正常打开。
- 输入框、按钮和输出区域可用。
- 点击按钮后结果稳定出现。
- 文字不溢出、不重叠。
- 手机或电脑录屏时画面清楚。
- 没有真实 API key、登录流程或网络依赖。
- Demo 一眼能看懂 IDBLOOM 如何把家庭主妇的个人特质转化为经济价值。

### 外网部署建议

GitHub Pages 可以继续用，不会影响已有 blog。

如果 blog 占用的是 `username.github.io` 这个用户主页仓库，本项目可以用 **Project Pages**：

```text
https://username.github.io/BPAHK-Project/
```

最省事部署方式：

1. 如果是纯静态网页，把 `index.html`、`style.css`、`script.js` 放在仓库根目录或 `docs/` 目录。
2. 到 GitHub 仓库 `Settings -> Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`。
5. Folder 选择 `/root` 或 `/docs`，看文件放在哪里。
6. 保存后等 1-3 分钟，打开 GitHub Pages 给出的链接。

如果用 Vite / React：

- 优先设置 `base: "/BPAHK-Project/"`。
- build 后把 `dist` 部署到 Pages。
- 如果时间紧，建议不要用 React，直接纯静态，少一个构建坑。

备用方案：

- Netlify Drop：把静态文件夹拖上去即可。
- Vercel：导入 GitHub 仓库即可。
- Cloudflare Pages：导入 GitHub 仓库即可。

本次比赛录屏优先级：

**GitHub Project Pages > Netlify Drop > Vercel/Cloudflare Pages > 本地录屏**

### 不要做

- 不要做完整登录系统。
- 不要做数据库。
- 不要接真实支付。
- 不要接真实小红书、TikTok、淘宝 API。
- 不要花时间做复杂后端。
- 不要做一堆无关页面。

先做一个漂亮、稳定、可录屏的一页 Demo。后续如果需要，再扩展。
