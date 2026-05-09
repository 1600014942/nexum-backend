import React, { useEffect, useMemo, useRef, useState } from "react";

/*
  Nexum / TokenLink ACU Trading Frontend Demo
  Update applied:
  1) Rewrites ACU as a standardized deliverable AI workload unit, not a subscription split.
  2) Adds richer contract switching across spot ACU, forward compute, basket, and productivity-index products.
  3) Adds AI Capacity Productivity Index (AIPI): unit-cost purchasing power for standardized AI work.
  4) Keeps local SVG K-line chart and local SVG icons; no external chart/icon dependencies.
*/

const markets = {
  "ACU-CHAT-S-SPOT": {
    symbol: "ACU-CHAT-S/USD",
    name: "Standard Chat Workload",
    productClass: "Spot ACU",
    type: "Small Order / 标准对话工作量",
    contractStyle: "Deliverable spot workload",
    quoteLabel: "USD per ACU",
    acuType: "Chat",
    modelTier: "Standard / Advanced",
    workload: "1 ACU = 1,000 successful short-form chat completions",
    deliveryWindow: "Immediate to 30D",
    reliabilityPool: "API pool + expiring subscription inventory",
    taskBoundary: "Low-risk text, writing, summary, Q&A",
    unit: "1 ACU = 1,000 successful chat completions under defined model tier and SLA",
    description:
      "用于标准短文本对话、写作、摘要和普通问答。它不是某个账号的拆分份额，而是在特定模型档位、任务边界、交付时限和可靠性条件下可交付的标准 AI 工作量。",
    last: 0.082,
    change: 3.42,
    fair: 0.079,
    basePrice: 0.12,
    quality: 1.04,
    reliability: 0.96,
    latency: 0.98,
    sla: "95%+ success receipt",
    delivery: "API Gateway / Credit Routing",
    depth: "Retail + broker inventory",
  },
  "ACU-LONG-M-30D": {
    symbol: "ACU-LONG-M/USD",
    name: "Long Document Workload",
    productClass: "Spot ACU",
    type: "Long Context / 长文档工作量",
    contractStyle: "Deliverable workload",
    quoteLabel: "USD per ACU",
    acuType: "Long",
    modelTier: "Advanced / Reasoning",
    workload: "1 ACU = 100 long-context jobs or agreed token-equivalent package",
    deliveryWindow: "30D",
    reliabilityPool: "Router + fallback providers",
    taskBoundary: "Long documents, research files, contracts, reports",
    unit: "1 ACU = 100 long-context jobs within 30 days, adjusted by model tier and completion receipt",
    description:
      "面向论文、报告、合同和研究资料处理。价格不是简单 token 单价，而由上下文窗口、质量档位、完成率、可用期和回执规则共同形成。",
    last: 0.164,
    change: -1.18,
    fair: 0.169,
    basePrice: 0.22,
    quality: 1.08,
    reliability: 0.98,
    latency: 0.94,
    sla: "98%+ completion receipt",
    delivery: "Router + fallback providers",
    depth: "API vendors + power users",
  },
  "ACU-CODE-S-30D": {
    symbol: "ACU-CODE-S/USD",
    name: "Code Assistance Workload",
    productClass: "Spot ACU",
    type: "Code / 代码辅助工作量",
    contractStyle: "Deliverable workload",
    quoteLabel: "USD per ACU",
    acuType: "Code",
    modelTier: "Reasoning / Frontier optional",
    workload: "1 ACU = 300 verified code-assist interactions",
    deliveryWindow: "30D",
    reliabilityPool: "API pool + developer quota",
    taskBoundary: "Code review, debugging, scripts, repo-level assistance",
    unit: "1 ACU = 300 verified code-assist interactions under code-capable model tier",
    description:
      "面向代码解释、修改、调试和脚本辅助。该合约强调可验证交付：请求、响应、成功状态、失败替换和必要的人工复核边界。",
    last: 0.138,
    change: 2.06,
    fair: 0.134,
    basePrice: 0.19,
    quality: 1.12,
    reliability: 0.95,
    latency: 0.97,
    sla: "verified assist receipt",
    delivery: "Code-capable model router",
    depth: "Developers + SaaS teams",
  },
  "ACU-VISION-M-30D": {
    symbol: "ACU-VISION-M/USD",
    name: "Vision / Multimodal Workload",
    productClass: "Spot ACU",
    type: "Vision / 多模态工作量",
    contractStyle: "Deliverable workload",
    quoteLabel: "USD per ACU",
    acuType: "Vision",
    modelTier: "Advanced multimodal",
    workload: "1 ACU = 500 image-understanding or multimodal requests",
    deliveryWindow: "30D",
    reliabilityPool: "Multimodal API pool",
    taskBoundary: "Image understanding, visual QA, light document extraction",
    unit: "1 ACU = 500 successful multimodal requests with defined file limits and SLA",
    description:
      "用于图像理解、视觉问答、轻量文档抽取。该品种的核心是把文件大小、图像数量、模型档位和成功回执纳入同一交付标准。",
    last: 0.112,
    change: 1.44,
    fair: 0.109,
    basePrice: 0.17,
    quality: 1.05,
    reliability: 0.94,
    latency: 0.93,
    sla: "multimodal success receipt",
    delivery: "Vision model gateway",
    depth: "App developers + AI studios",
  },
  "ACU-BATCH-24H": {
    symbol: "ACU-BATCH-24H/USD",
    name: "Batch Workload · 24H",
    productClass: "Spot ACU",
    type: "Batch / 批处理工作量",
    contractStyle: "Deferred deliverable workload",
    quoteLabel: "USD per ACU",
    acuType: "Batch",
    modelTier: "Standard / Advanced",
    workload: "1 ACU = one scheduled batch job package",
    deliveryWindow: "24H",
    reliabilityPool: "Batch queue + off-peak routing",
    taskBoundary: "Bulk summary, classification, cleaning, tagging",
    unit: "1 ACU = one agreed batch workload package delivered within 24 hours",
    description:
      "用于非实时任务。它把延迟折价转化为可交易的价格差：用户接受 24 小时内交付，平台获得批处理、低峰路由和成本优化空间。",
    last: 0.056,
    change: -0.74,
    fair: 0.058,
    basePrice: 0.1,
    quality: 0.99,
    reliability: 0.97,
    latency: 0.82,
    sla: "24H completion receipt",
    delivery: "Scheduled batch queue",
    depth: "Research labs + operations teams",
  },
  "ACU-ASSIST-S-30D": {
    symbol: "ACU-ASSIST-S/USD",
    name: "Assisted AI Usage Workload",
    productClass: "Spot ACU",
    type: "Assisted / 协助使用工作量",
    contractStyle: "Service-wrapped deliverable workload",
    quoteLabel: "USD per ACU",
    acuType: "Assist",
    modelTier: "Standard / Advanced",
    workload: "1 ACU = AI usage + basic prompt assistance package",
    deliveryWindow: "30D",
    reliabilityPool: "Human-assisted gateway",
    taskBoundary: "Prompt setup, ordinary AI use, structured output support",
    unit: "1 ACU = standardized AI workload plus basic usage assistance",
    description:
      "面向不熟悉 AI 的用户。该品种不是卖 token，而是卖可完成的 AI 使用过程：需求澄清、prompt 辅助、模型调用、结果回执。",
    last: 0.104,
    change: 0.88,
    fair: 0.101,
    basePrice: 0.15,
    quality: 1.02,
    reliability: 0.93,
    latency: 0.9,
    sla: "assisted usage receipt",
    delivery: "Human-assisted AI desk",
    depth: "SMB + non-technical users",
  },
  "ACU-H100-GPUH-FWD-30D": {
    symbol: "ACU-H100-FWD30/USD",
    name: "H100 Compute Forward",
    productClass: "Forward Compute",
    type: "Large Order / 算力中心级流动性",
    contractStyle: "Forward deliverable compute",
    quoteLabel: "USD per normalized GPU-hour ACU",
    acuType: "GPU-hour anchored ACU",
    modelTier: "H100-SXM normalized",
    workload: "1 ACU = 1 normalized H100-SXM GPU-hour equivalent",
    deliveryWindow: "30D forward delivery",
    reliabilityPool: "Reserved GPU-hour / verified telemetry",
    taskBoundary: "Inference or batch workloads under telemetry proof",
    unit: "1 ACU = 1 normalized H100-SXM GPU-hour, US-East, non-preemptible, 30D delivery",
    description:
      "面向数据中心、GPU owner、AI SaaS 和做市商。GPU 小时不是 ACU 本身，而是上游成本锚；合约交割仍以可验证的 AI 工作量或标准化 GPU-hour 能力为准。",
    last: 2.42,
    change: 5.86,
    fair: 2.36,
    basePrice: 3.2,
    quality: 1.03,
    reliability: 0.99,
    latency: 0.96,
    sla: "99% uptime / verified telemetry",
    delivery: "Reserved GPU-hour / bilateral settlement",
    depth: "Data centers + market makers",
  },
  "ACU-H200-GPUH-FWD-90D": {
    symbol: "ACU-H200-FWD90/USD",
    name: "H200 Compute Forward",
    productClass: "Forward Compute",
    type: "Large Order / 高端推理远期",
    contractStyle: "Forward deliverable compute",
    quoteLabel: "USD per normalized GPU-hour ACU",
    acuType: "GPU-hour anchored ACU",
    modelTier: "H200 normalized",
    workload: "1 ACU = 1 normalized H200 GPU-hour equivalent",
    deliveryWindow: "90D forward delivery",
    reliabilityPool: "Reserved GPU inventory + SLA",
    taskBoundary: "High-throughput inference, long-context batch, enterprise workloads",
    unit: "1 ACU = 1 normalized H200 GPU-hour equivalent, 90D delivery, telemetry verified",
    description:
      "用于锁定未来高端推理资源。该品种适合预算管理和供给侧出租率管理，价格受硬件代际、地域、可用期和可靠性影响。",
    last: 3.08,
    change: 4.21,
    fair: 2.97,
    basePrice: 4.1,
    quality: 1.06,
    reliability: 0.985,
    latency: 0.95,
    sla: "reserved capacity receipt",
    delivery: "Reserved H200-equivalent capacity",
    depth: "DC pools + institutional RFQ",
  },
  "ACU-B200-GPUH-FWD-180D": {
    symbol: "ACU-B200-FWD180/USD",
    name: "B200 Compute Forward",
    productClass: "Forward Compute",
    type: "Frontier Compute / 前沿算力远期",
    contractStyle: "Forward deliverable compute",
    quoteLabel: "USD per normalized GPU-hour ACU",
    acuType: "GPU-hour anchored ACU",
    modelTier: "B200 normalized",
    workload: "1 ACU = 1 normalized B200 GPU-hour equivalent",
    deliveryWindow: "180D forward delivery",
    reliabilityPool: "Future reserved inventory + SLA",
    taskBoundary: "Frontier inference, enterprise reservation, hedging inventory risk",
    unit: "1 ACU = 1 normalized B200 GPU-hour equivalent, 180D forward delivery",
    description:
      "用于远期前沿算力锁价。它不把硬件本身证券化，而是把未来可交付的标准化 AI 使用能力转化为可报价合约。",
    last: 4.72,
    change: -2.34,
    fair: 4.88,
    basePrice: 6.4,
    quality: 1.1,
    reliability: 0.96,
    latency: 0.92,
    sla: "future capacity delivery rule",
    delivery: "Forward reserved capacity",
    depth: "Large buyers + DC sellers",
  },
  "ACU-BASKET-90D": {
    symbol: "ACU-BASKET90/USD",
    name: "AI Usage Basket",
    productClass: "Basket / RFQ",
    type: "Index Basket / 篮子锁价",
    contractStyle: "Basket delivery or cash settlement",
    quoteLabel: "USD per basket ACU",
    acuType: "Weighted basket",
    modelTier: "Mixed model + GPU-hour anchor",
    workload: "1 ACU = weighted basket across chat, long, code, batch, and GPU-hour anchors",
    deliveryWindow: "90D",
    reliabilityPool: "Institutional RFQ + OTC book",
    taskBoundary: "Budget lock, usage planning, enterprise procurement",
    unit: "1 ACU = weighted AI usage capability basket across model tokens and GPU-hours",
    description:
      "用于成本锁定和预算管理。它把 token 计量、GPU-hour 成本锚、交付时限和质量调整合成一个可报价的企业采购合约。",
    last: 1.18,
    change: 0.74,
    fair: 1.16,
    basePrice: 1.55,
    quality: 1.05,
    reliability: 0.97,
    latency: 0.93,
    sla: "basket-level delivery rule",
    delivery: "Cash settlement or usage delivery",
    depth: "Institutional RFQ + OTC book",
  },
  "AIPI-ACU-PROD-IDX": {
    symbol: "AIPI-ACU/USD",
    name: "AI Capacity Productivity Index",
    productClass: "Productivity Index",
    type: "Index / AI 使用能力生产率指数",
    contractStyle: "Non-deliverable index contract",
    quoteLabel: "index points",
    acuType: "Productivity index",
    modelTier: "Quality-adjusted basket",
    workload: "Index = base ACU price / current ACU price × Q × R × L × 100",
    deliveryWindow: "Continuous index publication",
    reliabilityPool: "Price, quality, reliability, latency inputs",
    taskBoundary: "Trend analysis, financing narrative, cost-efficiency monitoring",
    unit: "AIPI measures how much standardized AI workload one unit of money can buy",
    description:
      "AI 使用能力生产率指数衡量单位成本可以买到多少标准 AI 工作量。它与 ACU Price 呈镜像关系：ACU Price 越低，单位资金获得的 AI 使用能力越高，指数越高。",
    last: 146.2,
    change: 8.64,
    fair: 142.8,
    basePrice: 100,
    quality: 1,
    reliability: 1,
    latency: 1,
    sla: "methodology-published index",
    delivery: "Index publication / cash settlement",
    depth: "Research + hedging + narrative product",
    isIndex: true,
  },
};

const productClasses = ["All", "Spot ACU", "Forward Compute", "Basket / RFQ", "Productivity Index"];

function explainContractCode(key, market) {
  const explanations = {
    "ACU-CHAT-S-SPOT": "标准对话工作量：短文本写作、摘要、问答的现货 ACU",
    "ACU-LONG-M-30D": "长文档工作量：30 天内可交付的长文本、文件理解、资料整理 ACU",
    "ACU-CODE-S-30D": "代码辅助工作量：30 天内可交付的代码解释、修改、调试 ACU",
    "ACU-VISION-M-30D": "多模态工作量：30 天内可交付的图片理解、视觉问答、文档抽取 ACU",
    "ACU-BATCH-24H": "批处理工作量：24 小时内完成的批量摘要、分类、清洗任务 ACU",
    "ACU-ASSIST-S-30D": "协助使用工作量：AI 调用 + 基础 prompt 协助的服务型 ACU",
    "ACU-H100-GPUH-FWD-30D": "H100 算力远期：30 天交付的标准化 H100 GPU-hour 能力合约",
    "ACU-H200-GPUH-FWD-90D": "H200 算力远期：90 天交付的标准化 H200 GPU-hour 能力合约",
    "ACU-B200-GPUH-FWD-180D": "B200 算力远期：180 天交付的前沿算力能力合约",
    "ACU-BASKET-90D": "AI 使用能力篮子：Chat、Long、Code、Batch 与 GPU-hour 的加权篮子",
    "AIPI-ACU-PROD-IDX": "AI 使用能力生产率指数：衡量单位成本可以买到多少标准 AI 工作量",
  };
  return explanations[key] || market?.name || "标准化 AI 工作量合约";
}

function decodeContractCode(key) {
  const parts = key.split("-");
  if (key.startsWith("AIPI")) return "AIPI = AI Capacity Productivity Index；PROD-IDX = 生产率指数";
  const type = parts[1] || "";
  const tier = parts[2] || "";
  const tenor = parts.slice(3).join("-") || "";
  const typeMap = {
    CHAT: "CHAT = 标准对话",
    LONG: "LONG = 长文档",
    CODE: "CODE = 代码辅助",
    VISION: "VISION = 多模态/视觉",
    BATCH: "BATCH = 批处理",
    ASSIST: "ASSIST = 协助使用",
    H100: "H100 = H100 GPU-hour 成本锚",
    H200: "H200 = H200 GPU-hour 成本锚",
    B200: "B200 = B200 GPU-hour 成本锚",
    BASKET: "BASKET = 加权篮子",
  };
  const tierMap = {
    S: "S = Standard 标准档",
    M: "M = Medium / Advanced 中高档",
    GPUH: "GPUH = 标准化 GPU 小时",
    "24H": "24H = 24 小时交付",
    "90D": "90D = 90 天期限",
  };
  const tenorText = tenor
    .replace("SPOT", "SPOT = 现货")
    .replace("30D", "30D = 30 天")
    .replace("90D", "90D = 90 天")
    .replace("180D", "180D = 180 天")
    .replace("FWD", "FWD = 远期");
  return ["ACU = AI Capacity Unit", typeMap[type], tierMap[tier], tenorText].filter(Boolean).join("；");
}

const initialBook = {
  asks: [
    { price: 0.089, size: 32000, source: "API Broker", tier: "临期" },
    { price: 0.087, size: 48000, source: "Model Vendor", tier: "临期" },
    { price: 0.085, size: 76000, source: "Compute Broker", tier: "混合" },
    { price: 0.083, size: 120000, source: "DC Pool A", tier: "中心" },
  ],
  bids: [
    { price: 0.081, size: 94000, source: "AI SaaS Buyer", tier: "企业" },
    { price: 0.079, size: 88000, source: "Agent App", tier: "小单" },
    { price: 0.077, size: 64000, source: "Quant Desk", tier: "做市" },
    { price: 0.075, size: 51000, source: "Research Lab", tier: "需求" },
  ],
};

function makeBaseCandles() {
  let seed = 73921;
  function rand() {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  }
  function normal() {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  const rows = [];
  let close = 0.0735;
  let volState = 0.018;
  const regimes = [
    { until: 14, drift: 0.0007, vol: 0.012 },
    { until: 25, drift: -0.0012, vol: 0.023 },
    { until: 39, drift: 0.0001, vol: 0.016 },
    { until: 51, drift: 0.0018, vol: 0.032 },
    { until: 64, drift: -0.0004, vol: 0.021 },
  ];

  for (let i = 0; i < 64; i += 1) {
    const regime = regimes.find((r) => i < r.until) || regimes[regimes.length - 1];
    volState = 0.82 * volState + 0.18 * regime.vol + Math.abs(normal()) * 0.0025;

    const gap = i === 19 ? -0.041 : i === 43 ? 0.052 : i === 54 ? -0.026 : normal() * volState * 0.16;
    const open = Math.max(0.025, close * (1 + gap));

    const bodyReturn = regime.drift + normal() * volState;
    close = Math.max(0.025, open * (1 + bodyReturn));

    const body = Math.abs(close - open);
    const baseRange = Math.max(open, close) * volState;
    const wickUp = baseRange * (0.25 + rand() * 1.8) + body * rand() * 0.7;
    const wickDown = baseRange * (0.2 + rand() * 1.7) + body * rand() * 0.65;
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(0.015, Math.min(open, close) - wickDown);
    const rangePct = (high - low) / open;
    const volumeShock = i === 19 || i === 43 || i === 54 ? 2.4 : 1;
    const volume = Math.round((42000 + rand() * 68000 + rangePct * 2600000) * volumeShock);

    rows.push({
      t: `05/${String(i + 1).padStart(2, "0")}`,
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume,
    });
  }
  return rows;
}

const baseCandles = makeBaseCandles();

function formatSize(n) {
  if (!Number.isFinite(Number(n))) return "0";
  const value = Number(n);
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

function formatPrice(n) {
  if (!Number.isFinite(Number(n))) return "0.0000";
  const value = Number(n);
  if (value >= 100) return value.toFixed(1);
  if (value >= 10) return value.toFixed(2);
  if (value >= 1) return value.toFixed(3);
  return value.toFixed(4);
}

function productivityIndex(market, livePrice = market.last) {
  if (market.isIndex) return market.last;
  const priceRatio = market.basePrice / Math.max(livePrice, 1e-9);
  return priceRatio * market.quality * market.reliability * market.latency * 100;
}

function scaleBook(book, marketKey, market) {
  const factor = market.last / markets["ACU-CHAT-S-SPOT"].last;
  const spreadShift = marketKey.includes("GPUH") ? market.last * 0.012 : marketKey.includes("BASKET") ? market.last * 0.006 : market.isIndex ? market.last * 0.001 : 0;
  const sizeFactor = marketKey.includes("GPUH") ? 0.09 : marketKey.includes("BASKET") ? 0.24 : market.isIndex ? 0.16 : 1;

  return {
    asks: book.asks
      .map((x, i) => ({
        ...x,
        price: Number((x.price * factor + spreadShift + i * factor * 0.0006).toFixed(market.last >= 10 ? 2 : 4)),
        size: Math.max(1, Math.round(x.size * sizeFactor)),
      }))
      .sort((a, b) => b.price - a.price),
    bids: book.bids
      .map((x, i) => ({
        ...x,
        price: Number((x.price * factor + spreadShift - i * factor * 0.0006).toFixed(market.last >= 10 ? 2 : 4)),
        size: Math.max(1, Math.round(x.size * sizeFactor)),
      }))
      .sort((a, b) => b.price - a.price),
  };
}

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function candleProfile(marketKey) {
  if (marketKey.includes("AIPI")) {
    return { drift: 0.0016, vol: 0.014, wave: 0.0035, shocks: [{ i: 16, v: 0.018 }, { i: 36, v: 0.031 }, { i: 52, v: -0.014 }], volumeBias: 0.65 };
  }
  if (marketKey.includes("B200")) {
    return { drift: -0.00035, vol: 0.041, wave: 0.006, shocks: [{ i: 12, v: 0.055 }, { i: 31, v: -0.074 }, { i: 47, v: 0.039 }], volumeBias: 1.55 };
  }
  if (marketKey.includes("H200")) {
    return { drift: 0.0011, vol: 0.035, wave: 0.004, shocks: [{ i: 18, v: -0.028 }, { i: 39, v: 0.061 }, { i: 56, v: -0.022 }], volumeBias: 1.35 };
  }
  if (marketKey.includes("H100")) {
    return { drift: 0.0008, vol: 0.032, wave: 0.005, shocks: [{ i: 10, v: 0.034 }, { i: 25, v: -0.045 }, { i: 44, v: 0.057 }], volumeBias: 1.28 };
  }
  if (marketKey.includes("BASKET")) {
    return { drift: 0.00025, vol: 0.009, wave: 0.002, shocks: [{ i: 22, v: -0.011 }, { i: 49, v: 0.014 }], volumeBias: 0.48 };
  }
  if (marketKey.includes("BATCH")) {
    return { drift: -0.00015, vol: 0.012, wave: 0.0025, shocks: [{ i: 20, v: -0.023 }, { i: 42, v: 0.016 }], volumeBias: 0.72 };
  }
  if (marketKey.includes("CODE")) {
    return { drift: 0.00055, vol: 0.026, wave: 0.0065, shocks: [{ i: 14, v: 0.041 }, { i: 33, v: -0.038 }, { i: 51, v: 0.029 }], volumeBias: 1.05 };
  }
  if (marketKey.includes("VISION")) {
    return { drift: 0.0001, vol: 0.019, wave: 0.007, shocks: [{ i: 17, v: -0.021 }, { i: 34, v: 0.027 }, { i: 58, v: -0.018 }], volumeBias: 0.9 };
  }
  if (marketKey.includes("LONG")) {
    return { drift: -0.00025, vol: 0.022, wave: 0.0045, shocks: [{ i: 13, v: -0.036 }, { i: 37, v: 0.033 }, { i: 54, v: -0.019 }], volumeBias: 0.95 };
  }
  if (marketKey.includes("ASSIST")) {
    return { drift: 0.0002, vol: 0.016, wave: 0.003, shocks: [{ i: 28, v: -0.019 }, { i: 46, v: 0.022 }], volumeBias: 0.68 };
  }
  return { drift: 0.00035, vol: 0.014, wave: 0.0025, shocks: [{ i: 19, v: -0.018 }, { i: 43, v: 0.024 }], volumeBias: 0.8 };
}

function timeframeProfile(timeframe) {
  const profiles = {
    "1m": { driftMul: 0.12, volMul: 0.22, waveMul: 0.12, shockMul: 0.18, volumeMul: 0.35, visible: 60, label: "microstructure" },
    "15m": { driftMul: 0.28, volMul: 0.42, waveMul: 0.28, shockMul: 0.35, volumeMul: 0.55, visible: 56, label: "intraday" },
    "1h": { driftMul: 0.55, volMul: 0.72, waveMul: 0.6, shockMul: 0.68, volumeMul: 0.82, visible: 52, label: "session" },
    "4h": { driftMul: 0.9, volMul: 1.05, waveMul: 1.05, shockMul: 1.05, volumeMul: 1.1, visible: 46, label: "swing" },
    "1D": { driftMul: 1.35, volMul: 1.55, waveMul: 1.45, shockMul: 1.6, volumeMul: 1.45, visible: 40, label: "macro trend" },
  };
  return profiles[timeframe] || profiles["1D"];
}

function visibleCountForTimeframe(timeframe) {
  return timeframeProfile(timeframe).visible;
}

function scaleCandles(candles, market, marketKey, timeframe) {
  let seed = hashString(`${marketKey}-${timeframe}`) + 73921;
  function rand() {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  }
  function normal() {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  const profile = candleProfile(marketKey);
  const tf = timeframeProfile(timeframe);
  const n = candles.length;
  const raw = [];
  let close = 1;
  let volState = profile.vol * tf.volMul;

  for (let i = 0; i < n; i += 1) {
    volState = 0.86 * volState + 0.14 * profile.vol * tf.volMul + Math.abs(normal()) * profile.vol * tf.volMul * 0.08;
    const baseShock = profile.shocks.find((s) => s.i === i)?.v || 0;
    const scheduledShock = baseShock * tf.shockMul;
    const phase = (hashString(`${marketKey}-${timeframe}`) % 17) / 10;
    const waveDrift = Math.sin((i / Math.max(n - 1, 1)) * Math.PI * 2.7 + phase) * profile.wave * tf.waveMul;
    const microstructureNoise = timeframe === "1m" ? normal() * profile.vol * 0.05 : 0;
    const gap = scheduledShock + normal() * volState * (timeframe === "1m" ? 0.08 : 0.2);
    const open = Math.max(0.08, close * (1 + gap));
    const bodyReturn = profile.drift * tf.driftMul + waveDrift + microstructureNoise + normal() * volState;
    close = Math.max(0.08, open * (1 + bodyReturn));

    const body = Math.abs(close - open);
    const rangeBase = Math.max(open, close) * volState;
    const wickMultiplier = timeframe === "1m" ? 0.65 : timeframe === "15m" ? 0.85 : timeframe === "1D" ? 1.18 : 1;
    const wickUp = rangeBase * wickMultiplier * (0.35 + rand() * 1.9) + body * rand() * 0.65;
    const wickDown = rangeBase * wickMultiplier * (0.3 + rand() * 1.7) + body * rand() * 0.62;
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(0.05, Math.min(open, close) - wickDown);
    const rangePct = (high - low) / open;
    const shockVolume = scheduledShock ? 2.2 : 1;
    const volume = Math.round((28000 + rand() * 92000 + rangePct * 1900000 * profile.volumeBias) * shockVolume * tf.volumeMul);

    raw.push({
      t: timeframe === "1m" ? `09:${String(i).padStart(2, "0")}` : timeframe === "15m" ? `${String(9 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}` : candles[i]?.t || `T${i + 1}`,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  const baseLast = baseCandles[baseCandles.length - 1]?.close || 1;
  const currentLast = candles[candles.length - 1]?.close || baseLast;
  const executionAnchor = currentLast / baseLast;
  const targetLast = market.last * executionAnchor;
  const scale = targetLast / raw[raw.length - 1].close;
  const decimals = market.last >= 10 ? 2 : 4;

  return raw.map((c) => ({
    ...c,
    open: Number((c.open * scale).toFixed(decimals)),
    high: Number((c.high * scale).toFixed(decimals)),
    low: Number((c.low * scale).toFixed(decimals)),
    close: Number((c.close * scale).toFixed(decimals)),
  }));
}

function getBestAsk(asks) {
  return asks.reduce((best, row) => (row.price < best.price ? row : best), asks[0]);
}

function getBestBid(bids) {
  return bids.reduce((best, row) => (row.price > best.price ? row : best), bids[0]);
}

function runSmokeTests() {
  const chatBook = scaleBook(initialBook, "ACU-CHAT-S-SPOT", markets["ACU-CHAT-S-SPOT"]);
  console.assert(chatBook.asks.length === 4, "Expected four ask levels");
  console.assert(chatBook.bids.length === 4, "Expected four bid levels");
  console.assert(getBestAsk(chatBook.asks).price > 0, "Best ask should be positive");
  console.assert(getBestBid(chatBook.bids).price > 0, "Best bid should be positive");
  console.assert(formatSize(120000) === "120.0K", "formatSize should abbreviate thousands");
  console.assert(formatSize(2500000) === "2.50M", "formatSize should abbreviate millions");
  console.assert(baseCandles.length >= 60, "Expected enough candles for a visible K-line chart");
  console.assert(baseCandles.every((c) => c.high >= Math.max(c.open, c.close) && c.low <= Math.min(c.open, c.close)), "Each candle must satisfy OHLC invariants");
  console.assert(productivityIndex(markets["ACU-CHAT-S-SPOT"]) > 100, "Lower current ACU price should imply higher productivity index");
}

runSmokeTests();

function Icon({ name, size = 18, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    cpu: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="0" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </>
    ),
    layers: (
      <>
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
      </>
    ),
    swap: <path d="M7 7h11l-3-3M17 17H6l3 3" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    activity: <path d="M22 12h-4l-3 8L9 4l-3 8H2" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
        <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
      </>
    ),
    gauge: (
      <>
        <path d="M12 14l4-4" />
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      </>
    ),
    zap: <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    candles: (
      <>
        <path d="M6 3v18M18 3v18M10 7v10M14 5v14" />
        <rect x="4" y="8" width="4" height="7" rx="0" />
        <rect x="16" y="6" width="4" height="10" rx="0" />
      </>
    ),
    trend: <path d="m3 17 6-6 4 4 8-8M14 7h7v7" />,
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.info}</svg>;
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-none border border-[#242424] bg-[#050505] shadow-[0_0_0_1px_rgba(255,255,255,0.015),inset_0_1px_0_rgba(255,255,255,0.035)] ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`rounded-none border border-[#2A2A2A] bg-[#080808] px-2.5 py-1 text-[11px] tracking-[0.08em] text-[#C9A646] ${className}`}>
      {children}
    </span>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="rounded-none border border-[#242424] bg-[#060606] p-3 transition hover:border-[#3A3214]">
      <div className="text-[11px] uppercase tracking-[0.08em] text-[#C9A646]">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
      {sub && <div className="mt-1 truncate text-xs text-[#8B8B8B]">{sub}</div>}
    </div>
  );
}

function OrderRows({ rows, side, onClick }) {
  const max = Math.max(...rows.map((r) => r.size), 1);
  return (
    <div className="space-y-1">
      {rows.map((row, idx) => (
        <button key={`${side}-${row.price}-${idx}`} onClick={() => onClick(row.price)} className="relative grid w-full grid-cols-4 overflow-hidden rounded-none px-2 py-1.5 text-left text-xs hover:bg-[#0A0A0A]">
          <div className={`absolute inset-y-0 ${side === "ask" ? "right-0 bg-red-500/10" : "left-0 bg-emerald-500/10"}`} style={{ width: `${(row.size / max) * 100}%` }} />
          <span className={`relative font-semibold ${side === "ask" ? "text-red-400" : "text-emerald-400"}`}>{formatPrice(row.price)}</span>
          <span className="relative text-right text-white">{formatSize(row.size)}</span>
          <span className="relative text-right text-[#999999]">{row.tier}</span>
          <span className="relative truncate text-right text-[#999999]">{row.source}</span>
        </button>
      ))}
    </div>
  );
}

function KLineChart({ data, marketKey, timeframe, setTimeframe }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [view, setView] = useState(() => ({
    start: Math.max(0, data.length - visibleCountForTimeframe(timeframe)),
    count: Math.min(data.length, visibleCountForTimeframe(timeframe)),
  }));
  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef(null);

  const width = 920;
  const height = 360;
  const pad = { top: 24, right: 68, bottom: 54, left: 10 };
  const plotW = width - pad.left - pad.right;
  const priceH = 245;
  const volumeTop = pad.top + priceH + 22;
  const volumeH = height - volumeTop - 28;
  const minVisibleCandles = 16;

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeView(nextStart, nextCount) {
    const count = clampNumber(Math.round(nextCount || visibleCountForTimeframe(timeframe)), Math.min(minVisibleCandles, data.length), Math.max(minVisibleCandles, data.length));
    const maxStart = Math.max(0, data.length - count);
    const start = clampNumber(Math.round(nextStart || 0), 0, maxStart);
    return { start, count };
  }

  useEffect(() => {
    const count = Math.min(data.length, visibleCountForTimeframe(timeframe));
    setView(normalizeView(data.length - count, count));
    setHoverIndex(null);
    dragRef.current = null;
    setIsPanning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, marketKey, timeframe]);

  const normalizedView = normalizeView(view.start, view.count);
  const visibleStart = normalizedView.start;
  const visibleCount = normalizedView.count;
  const visibleEnd = Math.min(data.length, visibleStart + visibleCount);
  const visible = data.slice(visibleStart, visibleEnd);
  const highs = visible.map((d) => d.high);
  const lows = visible.map((d) => d.low);
  const maxP = Math.max(...highs, 1);
  const minP = Math.min(...lows, 0);
  const pricePad = Math.max((maxP - minP) * 0.12, maxP * 0.015);
  const yMax = maxP + pricePad;
  const yMin = Math.max(0, minP - pricePad);
  const maxVol = Math.max(...visible.map((d) => d.volume), 1);
  const step = plotW / Math.max(visible.length, 1);
  const candleW = Math.max(2, Math.min(14, step * 0.58));
  const safeHoverIndex = hoverIndex === null ? visible.length - 1 : clampNumber(hoverIndex, 0, Math.max(visible.length - 1, 0));
  const hovered = visible[safeHoverIndex] || data[data.length - 1] || { open: 0, high: 0, low: 0, close: 0, volume: 0, t: "--" };

  function xAt(i) {
    return pad.left + i * step + step / 2;
  }

  function yAt(price) {
    return pad.top + ((yMax - price) / (yMax - yMin || 1)) * priceH;
  }

  function yVol(volume) {
    return volumeTop + volumeH - (volume / maxVol) * volumeH;
  }

  function localPoint(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = ((e.clientX - rect.left) / rect.width) * width;
    const localY = ((e.clientY - rect.top) / rect.height) * height;
    return { localX, localY };
  }

  function hoverFromLocalX(localX) {
    const raw = Math.floor((localX - pad.left) / step);
    return clampNumber(raw, 0, Math.max(visible.length - 1, 0));
  }

  function setViewAround(anchorRatio, nextCount) {
    const ratio = clampNumber(anchorRatio, 0, 1);
    const anchorGlobal = visibleStart + ratio * visibleCount;
    const count = clampNumber(Math.round(nextCount), Math.min(minVisibleCandles, data.length), data.length);
    const nextStart = anchorGlobal - ratio * count;
    setView(normalizeView(nextStart, count));
  }

  function zoomByFactor(factor, anchorRatio = 0.5) {
    setViewAround(anchorRatio, visibleCount * factor);
    setHoverIndex(null);
  }

  function shiftByCandles(delta) {
    setView((current) => normalizeView(current.start + delta, current.count));
    setHoverIndex(null);
  }

  function resetView() {
    const count = Math.min(data.length, visibleCountForTimeframe(timeframe));
    setView(normalizeView(data.length - count, count));
    setHoverIndex(null);
  }

  function handlePointerMove(e) {
    const { localX } = localPoint(e);

    if (dragRef.current) {
      e.preventDefault();
      const dx = e.clientX - dragRef.current.clientX;
      const candleDelta = Math.round(-dx / Math.max(step, 1));
      setView(normalizeView(dragRef.current.start + candleDelta, dragRef.current.count));
      setIsPanning(true);
      setHoverIndex(hoverFromLocalX(localX));
      return;
    }

    setHoverIndex(hoverFromLocalX(localX));
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      clientX: e.clientX,
      start: visibleStart,
      count: visibleCount,
    };
    setIsPanning(true);
  }

  function handlePointerUp(e) {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
    setIsPanning(false);
  }

  function handleWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const { localX } = localPoint(e);
    const anchorRatio = clampNumber((localX - pad.left) / plotW, 0, 1);
    const factor = e.deltaY > 0 ? 1.18 : 0.84;
    zoomByFactor(factor, anchorRatio);
  }

  const priceTicks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4).reverse();
  const canPanLeft = visibleStart > 0;
  const canPanRight = visibleEnd < data.length;
  const zoomPct = Math.round((visibleCount / Math.max(data.length, 1)) * 100);

  return (
    <div className="rounded-none border border-[#242424] bg-[#050505] p-3">
      <div className="mb-2 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Icon name="candles" /> K-line / Candlestick · {marketKey}</div>
          <div className="mt-1 text-[11px] text-[#777777]">鼠标滚轮缩放 · 左键拖动平移 · 双击重置视图</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex rounded-none bg-black p-1">
            {["1m", "15m", "1h", "4h", "1D"].map((x) => (
              <button key={x} onClick={() => setTimeframe(x)} className={`rounded-none px-3 py-1.5 ${timeframe === x ? "bg-[#C9A646] text-black" : "text-[#8B8B8B] hover:text-white"}`}>{x}</button>
            ))}
          </div>
          <div className="flex rounded-none border border-[#242424] bg-black">
            <button onClick={() => shiftByCandles(-Math.max(3, Math.round(visibleCount * 0.25)))} disabled={!canPanLeft} className="px-2.5 py-1.5 text-[#999999] hover:text-white disabled:opacity-30">←</button>
            <button onClick={() => zoomByFactor(0.78)} className="border-l border-[#242424] px-2.5 py-1.5 text-[#999999] hover:text-white">＋</button>
            <button onClick={() => zoomByFactor(1.28)} className="border-l border-[#242424] px-2.5 py-1.5 text-[#999999] hover:text-white">－</button>
            <button onClick={() => shiftByCandles(Math.max(3, Math.round(visibleCount * 0.25)))} disabled={!canPanRight} className="border-l border-[#242424] px-2.5 py-1.5 text-[#999999] hover:text-white disabled:opacity-30">→</button>
            <button onClick={resetView} className="border-l border-[#242424] px-2.5 py-1.5 text-[#C9A646] hover:text-[#FFD700]">Reset</button>
          </div>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2 text-xs text-[#999999] md:grid-cols-7">
        <span>O <b className="text-white">{formatPrice(hovered.open)}</b></span>
        <span>H <b className="text-emerald-300">{formatPrice(hovered.high)}</b></span>
        <span>L <b className="text-red-300">{formatPrice(hovered.low)}</b></span>
        <span>C <b className="text-white">{formatPrice(hovered.close)}</b></span>
        <span>Vol <b className="text-white">{formatSize(hovered.volume)}</b></span>
        <span>Time <b className="text-white">{hovered.t}</b></span>
        <span>View <b className="text-[#C9A646]">{visibleStart + 1}-{visibleEnd}/{data.length} · {zoomPct}%</b></span>
      </div>
      <div className={`h-[360px] w-full select-none overflow-hidden rounded-none bg-black ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseLeave={() => {
            if (!dragRef.current) setHoverIndex(null);
          }}
          onDoubleClick={resetView}
          onWheel={handleWheel}
        >
          <rect x="0" y="0" width={width} height={height} fill="#000000" />
          {priceTicks.map((tick) => {
            const y = yAt(tick);
            return (
              <g key={tick}>
                <line x1={pad.left} x2={width - pad.right + 6} y1={y} y2={y} stroke="#1D1D1D" strokeDasharray="3 4" />
                <text x={width - pad.right + 12} y={y + 4} fill="#999999" fontSize="11">{formatPrice(tick)}</text>
              </g>
            );
          })}
          {visible.map((d, i) => {
            const x = xAt(i);
            const up = d.close >= d.open;
            const color = up ? "#34d399" : "#fb7185";
            const yOpen = yAt(d.open);
            const yClose = yAt(d.close);
            const yHigh = yAt(d.high);
            const yLow = yAt(d.low);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yOpen - yClose));
            const volY = yVol(d.volume);
            const volH = volumeTop + volumeH - volY;
            return (
              <g key={`${d.t}-${visibleStart + i}`}>
                <rect x={x - candleW / 2} y={volY} width={candleW} height={volH} fill={color} opacity="0.22" />
                <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={color} strokeWidth="1.4" />
                <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} rx="0" fill={up ? color : "#090d14"} stroke={color} strokeWidth="1.4" />
              </g>
            );
          })}
          {hoverIndex !== null && visible.length > 0 && (
            <g pointerEvents="none">
              <line x1={xAt(safeHoverIndex)} x2={xAt(safeHoverIndex)} y1={pad.top} y2={height - 24} stroke="#C9A646" strokeDasharray="4 4" opacity="0.75" />
              <rect x={Math.min(xAt(safeHoverIndex) + 10, width - 220)} y="32" width="190" height="82" rx="0" fill="#050505" stroke="#333333" />
              <text x={Math.min(xAt(safeHoverIndex) + 22, width - 208)} y="52" fill="#FFFFFF" fontSize="12">{hovered.t} · {timeframe}</text>
              <text x={Math.min(xAt(safeHoverIndex) + 22, width - 208)} y="72" fill="#999999" fontSize="11">O {formatPrice(hovered.open)}  H {formatPrice(hovered.high)}</text>
              <text x={Math.min(xAt(safeHoverIndex) + 22, width - 208)} y="91" fill="#999999" fontSize="11">L {formatPrice(hovered.low)}  C {formatPrice(hovered.close)}</text>
              <text x={Math.min(xAt(safeHoverIndex) + 22, width - 208)} y="108" fill="#999999" fontSize="11">Vol {formatSize(hovered.volume)}</text>
            </g>
          )}
          <line x1={pad.left} x2={width - pad.right + 6} y1={volumeTop - 10} y2={volumeTop - 10} stroke="#1D1D1D" />
        </svg>
      </div>
    </div>
  );
}


function compactContractHint(key, market) {
  const hints = {
    "ACU-CHAT-S-SPOT": "Chat · 即时/30D",
    "ACU-LONG-M-30D": "Long Doc · 30D",
    "ACU-CODE-S-30D": "Code · 30D",
    "ACU-VISION-M-30D": "Vision · 30D",
    "ACU-BATCH-24H": "Batch · 24H",
    "ACU-ASSIST-S-30D": "Assisted · 30D",
    "ACU-H100-GPUH-FWD-30D": "H100 · FWD 30D",
    "ACU-H200-GPUH-FWD-90D": "H200 · FWD 90D",
    "ACU-B200-GPUH-FWD-180D": "B200 · FWD 180D",
    "ACU-BASKET-90D": "Basket · 90D",
    "AIPI-ACU-PROD-IDX": "Productivity Index",
  };

  return hints[key] || market.deliveryWindow || market.productClass;
}

function ProductSwitch({ marketKey, setMarketKey, activeClass, setActiveClass }) {
  const [open, setOpen] = useState(false);
  const market = markets[marketKey];
  const visibleMarkets = Object.entries(markets).filter(([, m]) => activeClass === "All" || m.productClass === activeClass);

  function chooseMarket(nextKey) {
    setMarketKey(nextKey);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A646]">
              <Icon name="swap" size={14} />
              Market Selector
            </div>
            <div className="mt-1 text-xs text-[#8B8B8B]">交易品种 / 合约切换</div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-[56px] w-full items-center justify-between rounded-none border border-[#2A2A2A] bg-[#020202] px-4 text-left transition hover:border-[#6E5A1D] lg:w-[580px]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-lg font-semibold text-white">{market.symbol}</span>
                <span className={`text-xs font-semibold ${market.change >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {market.change >= 0 ? "+" : ""}{market.change}%
                </span>
              </div>
              <div className="mt-0.5 truncate text-xs text-[#8B8B8B]">
                {compactContractHint(marketKey, market)} · {market.productClass} · {market.isIndex ? formatPrice(market.last) : `$${formatPrice(market.last)}`}
              </div>
            </div>
            <span className={`ml-3 shrink-0 text-lg text-[#C9A646] transition ${open ? "rotate-180" : ""}`}>⌄</span>
          </button>
        </div>
      </Card>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-none border border-[#2A2A2A] bg-[#030303] shadow-2xl shadow-black/80">
          <div className="border-b border-[#1F1F1F] p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C9A646]">Product Class</div>
            <div className="flex flex-wrap gap-1.5">
              {productClasses.map((klass) => (
                <button
                  key={klass}
                  onClick={() => setActiveClass(klass)}
                  className={`rounded-none border px-2.5 py-1 text-[11px] transition ${
                    activeClass === klass
                      ? "border-[#C9A646] bg-[#C9A646] text-black"
                      : "border-[#2A2A2A] bg-[#060606] text-[#8B8B8B] hover:border-[#6E5A1D] hover:text-[#C9A646]"
                  }`}
                >
                  {klass}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-2">
            {visibleMarkets.map(([key, m]) => {
              const selected = marketKey === key;
              const isUp = m.change >= 0;

              return (
                <button
                  key={key}
                  onClick={() => chooseMarket(key)}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_110px_80px] items-center gap-3 rounded-none border px-3 py-3 text-left transition ${
                    selected
                      ? "border-[#6E5A1D] bg-[#0D0B05]"
                      : "border-transparent hover:border-[#2A2A2A] hover:bg-[#0B0B0B]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">{m.symbol}</span>
                      {selected && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A646]" />}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-[#8B8B8B]">
                      {compactContractHint(key, m)} · {m.productClass}
                    </div>
                  </div>

                  <div className="text-right text-sm font-semibold text-white">
                    {m.isIndex ? formatPrice(m.last) : `$${formatPrice(m.last)}`}
                  </div>

                  <div className={`text-right text-xs font-semibold ${isUp ? "text-emerald-300" : "text-red-300"}`}>
                    {isUp ? "+" : ""}{m.change}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ACUDefinitionPanel() {
  const rows = [
    ["Definition", "Standardized AI workload", "不是账号拆分，不是单纯 token。"],
    ["Quote", "USD per ACU", "用于报价、撮合与结算。"],
    ["Delivery", "Receipt-based", "调用、完成率、遥测或回执证明履约。"],
    ["Boundary", "Task-bounded", "限定模型档位、任务范围和交付期限。"],
  ];

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-lg font-semibold"><Icon name="file" /> ACU Definition</div>
        <Badge>AI Capacity Unit</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {rows.map(([k, v, s]) => (
          <div key={k} className="rounded-none border border-[#242424] bg-[#060606] p-3">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[#C9A646]">{k}</div>
            <div className="mt-1 text-sm font-semibold text-white">{v}</div>
            <div className="mt-1 text-xs leading-5 text-[#8B8B8B]">{s}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProductivityPanel({ market, liveLast }) {
  const aipi = productivityIndex(market, liveLast);
  const priceRatio = market.isIndex ? 1 : market.basePrice / Math.max(liveLast, 1e-9);
  const rows = [
    ["AIPI", formatPrice(aipi), "单位成本购买力"],
    ["P_base / P_t", `${priceRatio.toFixed(2)}×`, "价格效率"],
    ["Q", market.quality.toFixed(2), "质量系数"],
    ["R", market.reliability.toFixed(2), "可靠性系数"],
    ["L", market.latency.toFixed(2), "延迟系数"],
  ];

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-lg font-semibold"><Icon name="trend" /> AIPI Method</div>
        <Badge>AIPI = P_base / P_t × Q × R × L × 100</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {rows.map(([k, v, s]) => (
          <div key={k} className="rounded-none border border-[#242424] bg-[#060606] p-3">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[#C9A646]">{k}</div>
            <div className="mt-1 text-lg font-semibold text-white">{v}</div>
            <div className="mt-1 text-xs text-[#8B8B8B]">{s}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ACUTradingFrontendDemo() {
  const [marketKey, setMarketKey] = useState("ACU-CHAT-S-SPOT");
  const [activeClass, setActiveClass] = useState("All");
  const [mainTab, setMainTab] = useState("chart");
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("0.0810");
  const [size, setSize] = useState("50000");
  const [book, setBook] = useState(initialBook);
  const [timeframe, setTimeframe] = useState("1D");
  const [candles, setCandles] = useState(baseCandles);
  const [tape, setTape] = useState([
    { id: 1, side: "buy", price: 0.082, size: 18000, text: "ACU-CHAT-S filled via API Broker", time: "09:31:08" },
    { id: 2, side: "sell", price: 0.081, size: 42000, text: "Expiring AI capacity listed", time: "09:30:24" },
    { id: 3, side: "buy", price: 0.08, size: 120000, text: "AI SaaS buyer RFQ matched", time: "09:28:44" },
  ]);
  const [balance, setBalance] = useState({ usd: 25000, acu: 180000, pnl: 1240 });

  const market = markets[marketKey];
  const scaledBook = useMemo(() => scaleBook(book, marketKey, market), [book, market.last, marketKey]);
  const chartData = useMemo(() => scaleCandles(candles, market, marketKey, timeframe), [candles, market, marketKey, timeframe]);
  const bestAsk = getBestAsk(scaledBook.asks);
  const bestBid = getBestBid(scaledBook.bids);
  const mid = (bestAsk.price + bestBid.price) / 2;
  const lastCandle = chartData[chartData.length - 1];
  const liveLast = lastCandle?.close || market.last;
  const parsedPrice = Number(price);
  const parsedSize = Number(size);
  const notional = Number.isFinite(parsedPrice * parsedSize) ? parsedPrice * parsedSize : 0;
  const aipi = productivityIndex(market, liveLast);

  const tabs = [
    { id: "chart", label: "图表", sub: "K-line" },
    { id: "instrument", label: "品种信息", sub: "Contract" },
    { id: "data", label: "交易数据", sub: "Market Data" },
    { id: "methodology", label: "指数方法", sub: "Methodology" },
  ];

  function applyPreset(kind) {
    if (kind === "small") {
      handleSetMarketKey("ACU-CHAT-S-SPOT");
      setActiveClass("Spot ACU");
      setMainTab("chart");
    } else if (kind === "large") {
      handleSetMarketKey("ACU-H100-GPUH-FWD-30D");
      setActiveClass("Forward Compute");
      setMainTab("chart");
    } else {
      handleSetMarketKey("AIPI-ACU-PROD-IDX");
      setActiveClass("Productivity Index");
      setMainTab("instrument");
    }
  }

  function handleSetMarketKey(nextKey) {
    const next = markets[nextKey];
    setMarketKey(nextKey);
    setPrice(String(formatPrice(next.last)));
    setSize(next.isIndex ? "100" : nextKey.includes("GPUH") ? "1200" : "50000");
  }

  function updateLastCandle(execPrice, execSize) {
    const factor = market.last / markets["ACU-CHAT-S-SPOT"].last;
    const normalizedPrice = execPrice / factor;
    setCandles((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      next[next.length - 1] = {
        ...last,
        close: Number(normalizedPrice.toFixed(4)),
        high: Number(Math.max(last.high, normalizedPrice).toFixed(4)),
        low: Number(Math.min(last.low, normalizedPrice).toFixed(4)),
        volume: last.volume + Math.round(execSize),
      };
      return next;
    });
  }

  function submitOrder() {
    const p = Number(price);
    const s = Number(size);
    if (!Number.isFinite(s) || s <= 0) return;

    const execPrice = orderType === "market" ? (side === "buy" ? bestAsk.price : bestBid.price) : p;
    if (!Number.isFinite(execPrice) || execPrice <= 0) return;

    const crosses = side === "buy" ? execPrice >= bestAsk.price : execPrice <= bestBid.price;
    const now = new Date().toLocaleTimeString("en-GB", { hour12: false });

    if (orderType === "market" || crosses) {
      updateLastCandle(execPrice, s);
      setTape((prev) => [
        { id: Date.now(), side, price: execPrice, size: s, text: `${marketKey} ${side === "buy" ? "bid took ask liquidity" : "ask hit bid liquidity"}`, time: now },
        ...prev,
      ].slice(0, 8));

      setBalance((b) =>
        side === "buy"
          ? { ...b, usd: b.usd - execPrice * s, acu: b.acu + s, pnl: b.pnl + 12 }
          : { ...b, usd: b.usd + execPrice * s, acu: Math.max(0, b.acu - s), pnl: b.pnl - 6 }
      );
    } else {
      const newLevel = { price: p, size: s, source: "Investor Demo", tier: side === "buy" ? "Bid" : "Ask" };
      setBook((prev) =>
        side === "buy"
          ? { ...prev, bids: [newLevel, ...prev.bids].sort((a, b) => b.price - a.price).slice(0, 6) }
          : { ...prev, asks: [newLevel, ...prev.asks].sort((a, b) => b.price - a.price).slice(0, 6) }
      );

      setTape((prev) => [
        { id: Date.now(), side, price: p, size: s, text: `${marketKey} new ${side === "buy" ? "bid" : "ask"} posted to book`, time: now },
        ...prev,
      ].slice(0, 8));
    }
  }

  function OrderBookPanel({ compact = false }) {
    return (
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-semibold"><Icon name="layers" /> Order Book</div>
          <Badge>USD</Badge>
        </div>
        <div className="mb-2 grid grid-cols-4 px-2 text-xs text-[#999999]"><span>Price</span><span className="text-right">Size</span><span className="text-right">Tier</span><span className="text-right">Source</span></div>
        <OrderRows rows={scaledBook.asks.slice(0, compact ? 4 : 6)} side="ask" onClick={(p) => setPrice(String(formatPrice(p)))} />
        <div className="my-3 rounded-none bg-black p-3 text-center">
          <span className="text-2xl font-semibold text-[#C9A646]">{formatPrice(liveLast)}</span>
          <span className="ml-2 text-sm text-[#999999]">mid {formatPrice(mid)}</span>
        </div>
        <OrderRows rows={scaledBook.bids.slice(0, compact ? 4 : 6)} side="bid" onClick={(p) => setPrice(String(formatPrice(p)))} />
      </Card>
    );
  }

  function PlaceOrderPanel() {
    return (
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-base font-semibold"><Icon name="swap" /> Place Order</div>
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-none bg-black p-1">
          <button onClick={() => setSide("buy")} className={`rounded-none py-2 text-sm font-semibold ${side === "buy" ? "bg-emerald-500 text-black" : "text-[#999999]"}`}>Buy / Bid</button>
          <button onClick={() => setSide("sell")} className={`rounded-none py-2 text-sm font-semibold ${side === "sell" ? "bg-red-500 text-white" : "text-[#999999]"}`}>Sell / Ask</button>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button onClick={() => setOrderType("limit")} className={`rounded-none border px-3 py-2 text-sm ${orderType === "limit" ? "border-[#C9A646] text-[#C9A646]" : "border-[#2A2A2A] text-[#8B8B8B]"}`}>Limit</button>
          <button onClick={() => setOrderType("market")} className={`rounded-none border px-3 py-2 text-sm ${orderType === "market" ? "border-[#C9A646] text-[#C9A646]" : "border-[#2A2A2A] text-[#8B8B8B]"}`}>Market</button>
        </div>
        <label className="mb-1 block text-xs text-[#999999]">Price, USD</label>
        <input disabled={orderType === "market"} value={price} onChange={(e) => setPrice(e.target.value)} className="mb-3 w-full rounded-none border border-[#2A2A2A] bg-black px-3 py-2 text-white outline-none placeholder:text-[#666666] focus:border-[#C9A646] disabled:opacity-50" />
        <label className="mb-1 block text-xs text-[#999999]">Quantity</label>
        <input value={size} onChange={(e) => setSize(e.target.value)} className="mb-3 w-full rounded-none border border-[#2A2A2A] bg-black px-3 py-2 text-white outline-none placeholder:text-[#666666] focus:border-[#C9A646]" />
        <div className="mb-4 rounded-none bg-black p-3 text-sm text-[#999999]">
          <div className="flex justify-between"><span>Estimated notional</span><span className="text-white">${notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
          <div className="mt-1 flex justify-between"><span>Matching rule</span><span className="text-white">price-time priority</span></div>
          <div className="mt-1 flex justify-between"><span>Receipt rule</span><span className="text-white">usage / telemetry proof</span></div>
        </div>
        <button onClick={submitOrder} className={`flex w-full items-center justify-center gap-2 rounded-none px-4 py-3 font-semibold ${side === "buy" ? "border border-[#2A2A2A] bg-[#C9A646] text-black hover:bg-[#DDBB54]" : "border border-[#2A2A2A] bg-black text-[#C9A646] hover:border-[#6E5A1D] hover:bg-[#0A0A0A]"}`}>
          <Icon name="play" size={16} /> Submit {side === "buy" ? "Bid" : "Ask"}
        </button>
      </Card>
    );
  }

  function TradesPanel() {
    return (
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-base font-semibold"><Icon name="activity" /> Recent Trades</div>
        <div className="space-y-2">
          {tape.map((x) => (
            <div key={x.id} className="rounded-none border border-[#242424] bg-[#050505] p-3 text-sm">
              <div className="flex justify-between gap-2"><span className={x.side === "buy" ? "text-emerald-400" : "text-red-400"}>{x.side.toUpperCase()} {formatSize(x.size)} @ {formatPrice(x.price)}</span><span className="text-xs text-[#999999]">{x.time}</span></div>
              <div className="mt-1 text-xs text-[#999999]">{x.text}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function AccountPanel() {
    return (
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-base font-semibold"><Icon name="database" /> Demo Account</div>
        <div className="grid grid-cols-3 gap-2">
          <Metric label="USD" value={`$${balance.usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <Metric label="ACU" value={formatSize(balance.acu)} />
          <Metric label="PnL" value={`+$${balance.pnl.toFixed(0)}`} />
        </div>
      </Card>
    );
  }

  function ChartTab() {
    return (
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <ProductSwitch marketKey={marketKey} setMarketKey={handleSetMarketKey} activeClass={activeClass} setActiveClass={setActiveClass} />
          <Card className="p-4">
            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              <Metric label={market.isIndex ? "Index Last" : "Last Price"} value={market.isIndex ? formatPrice(liveLast) : `$${formatPrice(liveLast)}`} sub={market.quoteLabel} />
              <Metric label="24h Change" value={`${market.change >= 0 ? "+" : ""}${market.change}%`} sub={market.productClass} />
              <Metric label="Best Bid" value={market.isIndex ? formatPrice(bestBid.price) : `$${formatPrice(bestBid.price)}`} sub={formatSize(bestBid.size)} />
              <Metric label="Best Ask" value={market.isIndex ? formatPrice(bestAsk.price) : `$${formatPrice(bestAsk.price)}`} sub={formatSize(bestAsk.size)} />
              <Metric label="AIPI" value={formatPrice(aipi)} sub="productivity" />
            </div>
            <KLineChart data={chartData} marketKey={marketKey} timeframe={timeframe} setTimeframe={setTimeframe} />
          </Card>
        </div>
        <aside className="space-y-4">
          <OrderBookPanel compact />
          <PlaceOrderPanel />
          <AccountPanel />
        </aside>
      </section>
    );
  }

  function InstrumentTab() {
    const contractFacts = [
      ["Symbol", market.symbol, market.productClass],
      ["Contract", market.contractStyle, compactContractHint(marketKey, market)],
      ["Unit", market.unit, market.quoteLabel],
      ["Delivery", market.deliveryWindow, market.delivery],
      ["Model Tier", market.modelTier, market.sla],
      ["Boundary", market.acuType, market.taskBoundary],
    ];

    return (
      <section className="space-y-4">
        <ProductSwitch marketKey={marketKey} setMarketKey={handleSetMarketKey} activeClass={activeClass} setActiveClass={setActiveClass} />
        <Card className="p-4">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold"><Icon name="info" /> Contract</div>
            <Badge>{marketKey}</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {contractFacts.map(([k, v, s]) => (
              <div key={k} className="rounded-none border border-[#242424] bg-[#060606] p-3">
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#C9A646]">{k}</div>
                <div className="mt-1 truncate text-sm font-semibold text-white" title={v}>{v}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-[#8B8B8B]" title={s}>{s}</div>
              </div>
            ))}
          </div>
        </Card>
        <ACUDefinitionPanel />
        <ProductivityPanel market={market} liveLast={liveLast} />
      </section>
    );
  }

  function DataTab() {
    return (
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_0.9fr_1fr]">
        <OrderBookPanel />
        <div className="space-y-4">
          <TradesPanel />
          <AccountPanel />
        </div>
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-lg font-semibold"><Icon name="gauge" /> Market Data</div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Best Bid" value={`$${formatPrice(bestBid.price)}`} sub={formatSize(bestBid.size)} />
            <Metric label="Best Ask" value={`$${formatPrice(bestAsk.price)}`} sub={formatSize(bestAsk.size)} />
            <Metric label="Spread" value={`$${formatPrice(bestAsk.price - bestBid.price)}`} sub={`${(((bestAsk.price - bestBid.price) / mid) * 100).toFixed(2)}%`} />
            <Metric label="24h Volume" value={marketKey.includes("GPUH") ? "$2.8M" : market.isIndex ? "$910K" : "$428K"} sub="demo liquidity" />
            <Metric label="Reference" value={market.isIndex ? formatPrice(market.fair) : `$${formatPrice(market.fair)}`} sub="fair input" />
            <Metric label="AIPI" value={formatPrice(aipi)} sub="unit-cost purchasing power" />
          </div>
          <div className="mt-4 rounded-none border border-[#2A2A2A] bg-black p-3 text-sm leading-6 text-[#999999]">
            Data priority: executed trades first, then executable RFQ quotes, then public list prices. Low-confidence data should be marked before being admitted into index calculation.
          </div>
        </Card>
      </section>
    );
  }

  function MethodologyTab() {
    const methodologyCards = [
      ["Price", "ACU Price", "成交金额 / 有效交付 ACU。"],
      ["Index", "AIPI", "衡量单位成本能买到多少标准 AI 工作量。"],
      ["Input", "Trade > RFQ > List", "成交优先，其次可执行报价，最后公开标价。"],
      ["Settlement", "Proof-based", "以使用回执、遥测、失败替换和退款确认履约。"],
      ["Risk", "Quality-adjusted", "质量、失败率和延迟会压低指数。"],
      ["Market", "Book + RFQ", "小单走簿，大单走 RFQ。"],
    ];

    return (
      <section className="space-y-4">
        <ProductivityPanel market={market} liveLast={liveLast} />
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-lg font-semibold"><Icon name="shield" /> Methodology</div>
            <Badge>Compact View</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {methodologyCards.map(([k, v, s]) => (
              <div key={k} className="rounded-none border border-[#242424] bg-[#060606] p-3">
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#C9A646]">{k}</div>
                <div className="mt-1 text-sm font-semibold text-white">{v}</div>
                <div className="mt-1 text-xs leading-5 text-[#8B8B8B]">{s}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 opacity-[0.075]" style={{ backgroundImage: "linear-gradient(rgba(201,166,70,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(201,166,70,0.10) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <header className="relative z-10 border-b border-[#1F1F1F] bg-[#020202]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-none border border-[#2A2A2A] text-[#8B8B8B]">☆</button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A646] text-black"><Icon name="cpu" size={17} /></div>
              <div>
                <div className="flex items-center gap-2">
                  <select value={marketKey} onChange={(e) => handleSetMarketKey(e.target.value)} className="max-w-[260px] rounded-none border border-transparent bg-transparent text-xl font-semibold tracking-tight outline-none hover:border-[#6E5A1D]">
                    {Object.entries(markets).map(([key, m]) => <option key={key} value={key}>{m.symbol}</option>)}
                  </select>
                  <span className={`text-sm font-semibold ${market.change >= 0 ? "text-emerald-300" : "text-red-300"}`}>{market.change >= 0 ? "+" : ""}{market.change}%</span>
                </div>
                <div className="max-w-[560px] truncate text-xs text-[#999999]">{market.productClass} · {compactContractHint(marketKey, market)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs md:grid-cols-4 xl:grid-cols-6">
              <div><div className="text-[#999999]">Last Price</div><div className="font-semibold text-white">{market.isIndex ? formatPrice(liveLast) : `$${formatPrice(liveLast)}`}</div></div>
              <div><div className="text-[#999999]">Fair Ref</div><div className="font-semibold text-white">{market.isIndex ? formatPrice(market.fair) : `$${formatPrice(market.fair)}`}</div></div>
              <div><div className="text-[#999999]">Best Bid</div><div className="font-semibold text-emerald-300">{formatPrice(bestBid.price)}</div></div>
              <div><div className="text-[#999999]">Best Ask</div><div className="font-semibold text-red-300">{formatPrice(bestAsk.price)}</div></div>
              <div><div className="text-[#999999]">AIPI</div><div className="font-semibold text-[#C9A646]">{formatPrice(aipi)}</div></div>
              <div><div className="text-[#999999]">Quote</div><div className="font-semibold text-white">USD</div></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => applyPreset("small")} className="rounded-none border border-[#2A2A2A] bg-[#050505] px-3 py-2 text-xs text-white transition hover:border-[#6E5A1D] hover:bg-[#0A0A0A]">Spot ACU</button>
            <button onClick={() => applyPreset("large")} className="rounded-none border border-[#2A2A2A] bg-[#050505] px-3 py-2 text-xs text-white transition hover:border-[#6E5A1D] hover:bg-[#0A0A0A]">Compute Forward</button>
            <button onClick={() => applyPreset("index")} className="rounded-none border border-[#2A2A2A] bg-[#050505] px-3 py-2 text-xs text-white transition hover:border-[#6E5A1D] hover:bg-[#0A0A0A]">AIPI Index</button>
            <button onClick={() => window.location.href = '/'} className="rounded-none border border-[#C9A646] bg-[#C9A646] px-3 py-2 text-xs text-black font-bold transition hover:bg-[#D4AF37]">Back to Main Site</button>
          </div>
        </div>
      </header>

      <nav className="relative z-10 border-b border-[#1F1F1F] bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1540px] gap-6 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setMainTab(tab.id)} className={`relative py-3 text-left text-sm font-semibold ${mainTab === tab.id ? "text-white" : "text-[#999999] hover:text-white"}`}>
              <span>{tab.label}</span>
              <span className="ml-2 text-xs font-normal text-[#999999]">{tab.sub}</span>
              {mainTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C9A646]" />}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-[1540px] p-4">
        {mainTab === "chart" && <ChartTab />}
        {mainTab === "instrument" && <InstrumentTab />}
        {mainTab === "data" && <DataTab />}
        {mainTab === "methodology" && <MethodologyTab />}
      </main>
    </div>
  );
}


