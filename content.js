// 统一编辑这里的项目资料。image 留空时显示明确标注的原创占位构图。
// 后续把 image 改成图片相对路径，并用 imageAlt 描述真实截图内容。
const portfolio = {
  email: 'Myy0721@outlook.com',
  projects: [

    {
      number: '01', title: '“再续前缘”', chinese: '关卡与叙事重构',
      titleKicker: 'BASED ON ARKNIGHTS: ENDFIELD',
      sideArt: 'assets/endfield/character-art-v3.png', sideArtAlt: '金发兽耳角色插画',
      type: '关卡与叙事重构', period: '2026.11', mode: '基于《明日方舟：终末地》的个人改编设计',
      role: '关卡设计 / 叙事重构 / Unity 可玩原型', theme: 'endfield',
      image: 'assets/endfield/cover-scene.png', imageAlt: '再续前缘 Unity 关卡白盒全景，展示山地、亭台、水域与探索路线',
      summary: '基于《明日方舟：终末地》“祀的画”部分地图的任务改编设计',
      details: [
        ['设计目标', '从角色陪伴驱动，转向角色关系与探索叙事共同驱动；以地面探索、书信线索和地下空间串联明暗两条叙事线。'],
        ['空间与机制', '以园林、自然环境和模块化场景为基础，结合对景、借景与高差安排路线；设计画卷连线、弹射装置、浮动荷叶与水位控制交互。'],
        ['当前完成范围', '已制作地面区域的 Unity 关卡白盒流程。地下叙事、高塔与最终战属于设计方案，未作为已完成内容展示。'],
      ],
      link: '', caseStudy: 'projects/endfield.html',
    },    {
      number: '02', title: 'All kinds of cats', chinese: '让解法，自由涌现。',
      type: '3D 休闲解谜', period: '2026.10', mode: 'TapTap GameJam · 团队项目',
      role: '机制与关卡策划 / Unity 开发', theme: 'cats', image: 'assets/cats/cover.png', imageAlt: 'All kinds of Cats 蓝色猫形岛屿封面',
      placeholder: '待替换：法阵与环境组合交互截图',
      summary: '围绕「涌现」，让毛线法阵与环境对象发生组合交互。用一套规则，打开不止一种解谜路径。',
      details: [
        ['设计思路', '以力、活性、传送三类效果为基础，设计法阵与环境的组合交互；通过法阵携带机制，让玩家移动法阵并组合环境效果。'],
        ['已实现内容', 'Demo 已完成第一关开发；每处障碍提供至少 3 种解法，探索同一目标下的多种解决路径。']
      ],
      link: 'https://myy09845742.itch.io/cat-light-ball', caseStudy: 'projects/cats.html', caseLabel: '进入项目试玩', diagram: 'FORCE / VITALITY / TELEPORT',
    },
    {
      number: '03', title: 'Emotion Harvester: Bitha', chinese: '情感，是故事的另一种养料。',
      type: '2D 女性向剧情解谜', period: '2024 — 2025', mode: '个人项目',
      role: '游戏文案策划 / 2D 美术 / Unity 开发', theme: 'bitha', image: 'assets/bitha/cover.png', imageAlt: 'Emotion Harvester 游戏封面，展示 Bitha 与其他角色',
      placeholder: '待替换：探索场景与角色对话截图',
      summary: '从以情感为养料的 Bitha 视角出发，围绕校园绑架案展开侦破，连接悬疑叙事与探索解谜。',
      details: [
        ['设计思路', '完成教室、实验室、地下停车场等关卡及场景设计，搭建探索、对话、躲避与安全区机制，并撰写完整悬疑剧情文本。'],
        ['已实现内容', '实现角色跟随、手电筒侦测、物品拾取、NPC 对话和 Spine 动画。']
      ],
      link: 'https://myy09845742.itch.io/emotion-harvester', caseStudy: 'projects/bitha.html', caseLabel: '查看作品介绍', diagram: 'EXPLORE / FEEL / UNCOVER',
    },
  ],
};
