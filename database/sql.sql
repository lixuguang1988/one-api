-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        8.0.41 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 导出 onedatabase 的数据库结构
CREATE DATABASE IF NOT EXISTS `onedatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `onedatabase`;

-- 导出  表 onedatabase.columns 结构
CREATE TABLE IF NOT EXISTS `columns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `parent_id` int DEFAULT NULL,
  `status` int DEFAULT '1' COMMENT '0 已删除 1正常',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_columns_columns` (`parent_id`),
  CONSTRAINT `FK_columns_columns` FOREIGN KEY (`parent_id`) REFERENCES `columns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.columns 的数据：~9 rows (大约)
INSERT INTO `columns` (`id`, `name`, `code`, `description`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
	(1, '公司新闻', 'news', '栏目的简介', NULL, 1, '2025-05-11 05:10:36', '2025-05-11 05:10:36'),
	(2, '公司产品', 'product', NULL, NULL, 1, '2025-05-11 05:11:23', '2025-05-11 05:11:23'),
	(3, '3C', '3C', '3c', 2, 1, '2025-05-11 05:17:56', '2025-05-11 05:17:56'),
	(4, '机器人', 'robot', '机器人产品', 2, 1, '2025-05-11 05:24:51', '2025-05-11 05:24:51'),
	(5, '文创', 'cultural-creative', '文创周边产品', 2, 1, '2025-05-11 05:26:29', '2025-05-11 05:26:29'),
	(6, '人才招聘', 'hire', NULL, NULL, 1, '2025-05-11 05:27:53', '2025-05-11 05:27:53'),
	(7, '联系我们', 'contact', NULL, NULL, 1, '2025-05-11 05:28:16', '2025-05-11 05:28:16'),
	(8, '首页', 'home', '首页', NULL, 1, '2025-05-11 05:28:45', '2025-05-11 05:28:45'),
	(14, '产业新闻', 'industry-news', NULL, 1, 1, '2025-05-26 13:09:13', '2025-05-26 13:09:13');

-- 导出  表 onedatabase.departments 结构
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `parent_id` int DEFAULT NULL,
  `status` int DEFAULT '1' COMMENT '0 已删除 1正常',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_departments_departments` (`parent_id`),
  CONSTRAINT `FK_departments_departments` FOREIGN KEY (`parent_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.departments 的数据：~6 rows (大约)
INSERT INTO `departments` (`id`, `name`, `description`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
	(1, '礼记快餐南京公司', '南京公司', NULL, 1, '2025-04-16 13:00:16', '2025-04-16 13:00:16'),
	(2, '行政部', '南京公司行政', 1, 1, '2025-04-16 13:01:13', '2025-04-16 13:01:13'),
	(3, '保安部', '南京公司保安', 1, 1, '2025-04-16 13:02:43', '2025-04-16 13:02:43'),
	(4, '服务部', '南京公司保安', 1, 1, '2025-04-16 13:03:05', '2025-04-16 13:03:05'),
	(5, '礼记快餐常州公司', '礼记快餐常州公司', NULL, 1, '2025-04-16 13:03:51', '2025-04-16 13:03:51'),
	(6, '财务部', '礼记快餐常州公司财务', 5, 1, '2025-04-16 13:04:33', '2025-04-16 14:03:07'),
	(7, '客房部', '礼记快餐常州公司客房部', 5, 1, '2025-04-16 14:04:21', '2025-04-16 14:04:21');

-- 导出  表 onedatabase.dicts 结构
CREATE TABLE IF NOT EXISTS `dicts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '分类编码（可选）',
  `parent_id` int DEFAULT NULL COMMENT '父级分类ID，NULL为根节点',
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `dicts_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `dicts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.dicts 的数据：~9 rows (大约)
INSERT INTO `dicts` (`id`, `name`, `code`, `parent_id`, `description`, `created_at`, `updated_at`) VALUES
	(1, '颜色', 'color', NULL, '宠物颜色', '2025-05-28 12:31:20', '2025-05-28 12:40:42'),
	(2, '黄色', 'yellow', 1, NULL, '2025-05-28 12:33:32', '2025-05-28 12:33:32'),
	(3, '白色', 'white', 1, NULL, '2025-05-28 12:35:45', '2025-05-28 12:35:45'),
	(4, '灰色', 'grey', 1, NULL, '2025-05-28 12:36:36', '2025-05-28 12:37:25'),
	(5, '品种', 'class', NULL, '猫狗兔', '2025-05-28 12:38:10', '2025-05-28 12:38:10'),
	(6, '狗', 'dog', 5, NULL, '2025-05-28 12:39:25', '2025-05-28 12:39:25'),
	(7, '猫', 'cat', 5, NULL, '2025-05-28 12:39:35', '2025-05-28 12:39:35'),
	(8, '兔子', 'rabbit', 5, NULL, '2025-05-28 13:13:39', '2025-05-28 13:13:39'),
	(9, '仓鼠', 'hamster', 5, '仓鼠', '2025-05-28 13:17:33', '2025-05-28 13:17:33');

-- 导出  表 onedatabase.news 结构
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `priority` int DEFAULT NULL,
  `source` text COLLATE utf8mb4_general_ci,
  `creater_id` int DEFAULT NULL,
  `updater_id` int DEFAULT NULL,
  `columns` json DEFAULT NULL,
  `status` int DEFAULT '1' COMMENT '0 已删除 1正常',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- 正在导出表  onedatabase.news 的数据：~4 rows (大约)
INSERT INTO `news` (`id`, `title`, `description`, `color`, `picture`, `content`, `priority`, `source`, `creater_id`, `updater_id`, `columns`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'title', 'ddd', NULL, NULL, '<p>从发文网友的口吻中可以得知，隋永清生前不但演技超群，而且私人为人甚好，性格开朗，对身边朋友也是相当热情，值得大家永久铭记。</p>', NULL, NULL, 10, 10, NULL, 1, '2025-05-19 12:36:13', '2025-05-21 13:14:37'),
	(2, 'gggg', 'ddddddd', 'hsl(308, 54%, 29%)', 'http://localhost:3000/uploads/1747658246187-th.jpg', '<h2 style="text-align: center;">ddddd</h2>', NULL, NULL, 10, 10, '[1]', 1, '2025-05-19 12:52:08', '2025-05-21 13:30:32'),
	(3, '—无锡高质量发展中的人文经济学观察', '这是一座被自然厚爱的城市，城抱湖、河抱城、滨江通海，造就了太湖明珠、运河佳处，赋予其生生不息又韵律独特的城市脉动。', '#f5a623', 'http://localhost:3000/uploads/1747659361122-th.jpg', '<p class="p_text_indent_2">这是一座被自然厚爱的城市，城抱湖、河抱城、滨江通海，造就了太湖明珠、运河佳处，赋予其生生不息又韵律独特的城市脉动。</p>\n<p class="p_text_indent_2">这里是文化江南的起源地区，相传泰伯奔吴开启中原与南方的交流；这里是富庶江南的高光地带，古有米市、丝都、布码头，今有医药、制造、物联网；重实业、善交易的工商基因深入骨髓。</p>\n<p class="p_text_indent_2">芳草佳木间，昔时斗米尺布皆为温饱，今日发展之利普惠民生；人文渊薮地，此间名士别于书斋文人，务实笃行积厚流光。</p>\n<p class="p_text_indent_2">一曲吴韵风华，深藏万古江河；人文经济共舞，激荡澎湃动力。水流奔涌、勇于纳新，是自然孕育出的气派；经世致用、尚学崇教，是文化涵养出的气韵；实业兴邦、不惧挑战，是工商基因支撑起的气魄&hellip;&hellip;江南何止小桥流水，亦有包孕吴越的壮阔！</p>\n<p class="p_text_indent_2">时代潮流涌动，城市拔节生长。在加速奔向中国式现代化的壮阔航程中，无锡持续探寻人文经济共生共荣的发展密码，在传承中延续江南文脉，在创新中激活时代价值，明珠之光熠熠生辉。</p>\n<p><img src="https://news.jschina.com.cn/scroll/szyw/202401/W020240119711312543271.jpg"></p>\n<p class="p_text_indent_2">&ldquo;有骨&rdquo;江南，于斯为盛</p>\n<p class="p_text_indent_2">隆冬时节，从高空俯瞰太湖，如同打开一幅立体的山水画轴：湖水蓝、水杉红、芦苇黄，色彩交织美不胜收；从西伯利亚远道而来的红嘴鸥，正在湖边嬉戏飞翔；鼋头渚的崖壁之上，一块&ldquo;包孕吴越&rdquo;的石碑静静矗立。</p>\n<p class="p_text_indent_2">太湖古称震泽，后被称作&ldquo;太&rdquo;，取义比大多一点。&ldquo;三万六千顷，千顷颇黎色&rdquo;&ldquo;谁能胸贮三万顷，我欲身游七十峰&rdquo;，诗人皮日休与文徵明虽相隔数百年，皆言其壮阔。如今，一曲&ldquo;太湖美，美就美在太湖水&rdquo;宛转悠扬，更道尽人湖相依的牵绊。</p>\n<p class="p_text_indent_2">跨两省、依五市，太湖只捧出了一颗明珠；大运河蜿蜒3200多公里、流经35座城市，唯独在此处留下了&ldquo;江南水弄堂、运河绝版地&rdquo;的印记。</p>\n<p class="p_text_indent_2">走进无锡博物院，&ldquo;一弓九箭&rdquo;的龟背形古城轮廓引人驻足。九箭对应的不是道路，而是水路，两岸人家枕河而居，寺、塔、河、街、桥、窑、宅、坊众多空间元素有机组合。&ldquo;中国传统建城需要中轴线，无锡城的中轴线是城中直河，与其说大运河穿城而过，不如说是抱城而过。&rdquo;无锡博物院副院长陶冶说。</p>\n<p class="p_text_indent_2">太湖、滆湖、蠡湖水量充沛，古运河无锡段千年不淤，自元代起无锡跻身江南地区漕运中心，至清末民初达到顶峰，米布丝钱四大码头冠绝一时。</p>\n<p class="p_text_indent_2">码头便利贸易，也孕育文化。望虞河穿鹅湖而过，北接长江，南贯太湖，这里的荡口古镇距今已有3000多年，现存7万余平方米明清古建筑，华蘅芳、钱穆以及华君武故居点缀其中。今天的人们到访钱穆故居，目光先会被&ldquo;几百年人家无非积善，第一等好事还是读书&rdquo;的楹联捕捉，随后就会被钱家&ldquo;一门六院士&rdquo;的传奇震撼。太湖西岸的宜兴更是人杰地灵，这里先后走出32位两院院士、100多位大学校长、上万名教授学者，有着&ldquo;院士之乡&rdquo;&ldquo;教授之乡&rdquo;美誉。</p>\n<p class="p_text_indent_2">工业文明发轫，航道变身工业走廊。到20世纪30年代，运河水网沿线建成各类企业超300家，银行金融机构超30家，粉厂连布厂，纱厂连丝厂，积淀下了农耕文明向现代工业文明转型的江南风貌全景式遗产。</p>\n<p><img src="https://news.jschina.com.cn/scroll/szyw/202401/W020240119711332929170.png"></p>\n<p class="p_text_indent_2">昔日工业遗产，化作条条&ldquo;水弄堂&rdquo;。入夜，清名桥历史文化街区迎来一天中最动人的时刻。人们乘坐画舫穿梭在桨声灯影里，两岸的丝厂、茶楼、书场、戏台等古迹勾勒出迷人的水乡景致；岸上，前店后坊人头攒动，人们品尝着美食、香茗，陶醉于夜色下的江南风情。</p>\n<p class="p_text_indent_2">走出龟背古城，登上江阴城市记忆馆的楼顶露台，眼前又豁然开朗。江上船只来往忙碌，沿江岸线风光秀丽，不远处江阴长江大桥飞跨南北、气势雄伟。清末民初，长江中上游地区的瓷器、木材和川滇药材等物资经长江运抵江阴港集散，轮船招商局及日本太古、怡和等轮船公司也在此设立机构。如今，鹅鼻嘴公园内仍矗立着一块&ldquo;江尾海头&rdquo;的石碑，江阴港舟船满泊、商贾满街的景象更胜往昔。</p>\n<p class="p_text_indent_2">千百年来，穿城而过的运河、奔腾入海的长江、山温水软的太湖，赋予无锡生生不息又韵律独特的城市脉动。</p>\n<p class="p_text_indent_2">&ldquo;江河湖海的汇聚与碰撞，串联起众多的河湖荡氿，无锡的水文化在运河城市中颇为特殊，不绵软更有力量。&rdquo;江南大学副教授连冬花说。著名作家肖复兴则感慨，一句&ldquo;包孕吴越&rdquo;点出了无锡不仅有结实的骨架，更有包容的胸襟。</p>\n<p class="p_text_indent_2">走进刚落成的无锡梅里遗址博物馆，&ldquo;镇馆之宝&rdquo;陶鬲与鸭形壶吸引着参观者们驻足。前者多见于黄河流域，后者来自长江流域。2002年，同样形制的陶鬲在陕西岐山大量出土。河南二里头遗址博物馆则藏有类似的鸭形壶。三千年前，&ldquo;泰伯奔吴&rdquo;开启黄河文化与长江文化交流与流动的传说，在相隔千里、不同博物馆间完成了互证。</p>\n<p class="p_text_indent_2">相传，泰伯初到梅里只见一片荒蛮，他把中原地区的先进文化和耕种技术传授给当地人，带领人们兴修水利，开挖了中国历史上第一条人工运河&mdash;&mdash;伯渎河，江南文化由此兴盛。</p>\n<p class="p_text_indent_2">&ldquo;一曲吴歌酒半酣，声声字字是江南。&rdquo;千年之后，伯渎河依然延绵。走在无锡高新区的梅村街道，漫步于新旧交替的时光，逛一场烟火气十足的江南集，吴风雅韵历久弥新。</p>\n<p><img src="https://news.jschina.com.cn/scroll/szyw/202401/W020240119711352725717.jpg"></p>\n<p class="p_text_indent_2">实业为要，根深叶茂</p>\n<p class="p_text_indent_2">在珠海的隧道中，一台盾构机正在施工开掘，传感器每秒钟采集上千次数据。基于雪浪云工业互联网平台将感知数据汇总、协同，再&ldquo;翻译&rdquo;成施工人员看得懂的语言，掘进效率能够提升5%，设备故障率降低10%。</p>\n<p class="p_text_indent_2">汹涌澎湃，白浪飞花，浩浩荡荡如千军万马&mdash;&mdash;这幅景象让刘伯温有感而发，为太湖第一峰取名雪浪山。如今，以此命名的雪浪小镇只有3.5平方公里，雪浪云工业互联网平台却已深入工程机械、航空航天等22个行业，辐射全国。</p>\n<p class="p_text_indent_2">制造业如同浪，猛烈奔涌潮头；互联网恰似雪，轻盈覆盖万物。中国工程院院士王坚着迷于&ldquo;雪浪&rdquo;的制造基因，在他看来，不是制造业需要互联网、云计算、人工智能来拯救，而是&ldquo;没有制造业的互联网就没有未来&rdquo;。</p>\n<p class="p_text_indent_2">淬火、钻孔、磨削、清洗&hellip;&hellip;江阴恒润传动公司生产车间内，一个个环形的变桨轴承相继下线，订单来自几公里外的远景能源。作为全球第四大风电整机制造商，远景能源看中的也是&ldquo;制造&rdquo;：需要原料，兴澄特钢出品的连铸大圆坯可直接供货；需要加工，恒润环锻公司可将连铸坯制作成锻件；制造风机轮毂的吉鑫科技、提供风机塔筒的振江新能源等配套企业散布周边。</p>\n<p class="p_text_indent_2">压力越大，越见韧性。作为中国制造业第一县级市，江阴拥有规上工业企业超过2400家，全市61家上市公司大多分布在高端制造业。</p>\n<p class="p_text_indent_2">时钟拨回百年前，茂新面粉厂曾拥有最先进的生产线。今天，由此改造而来的无锡中国民族工商业博物馆，收藏着&ldquo;何以无锡&rdquo;的基因库。展厅醒目处可见&ldquo;工商之业不振，则中国终不可以富、不可以强&rdquo;，曾担任清政府驻英法意比四国公使的薛福成在游历欧洲后写下这句话，并从英国购买新式纺机100部用以织布局扩大生产规模。数据、图表更加直观，&ldquo;上海滩上的无锡实业家&rdquo;超过百名，到1937年，无锡的工业产值紧随上海、广州之后，居全国第三位。</p>\n<p class="p_text_indent_2">前身是轧钢厂，如今是梦工厂。无锡华莱坞通过数字科技赋能产业革新，加速朝着电影工业4.0迈进。墨境天合、倍视传媒等800余家影视文化企业落户，推出《中国机长》《人世间》《流浪地球2》等一批影视佳作。</p>\n<p><img src="https://news.jschina.com.cn/scroll/szyw/202401/W020240119711359149505.jpg"></p>\n<p class="p_text_indent_2">&ldquo;无锡人为什么着迷于实业，甚至兼营商业的目的也是为了进一步拓展实业？&rdquo;无锡市委党校副教授孟祥丰认为，一个地方选择什么样的发展方式，脱离不了其历史与文化。</p>\n<p class="p_text_indent_2">位于龟背城内的东林书院始建于北宋、重建于明代。&ldquo;风声雨声读书声，声声入耳；家事国事天下事，事事关心&rdquo;闻名于世，&ldquo;黜浮靡，崇实学&rdquo;东林学风影响深远。</p>\n<p class="p_text_indent_2">同样是明代，徐霞客从家乡出发，历时三十年考察大半个中国，纠正&ldquo;岷山导江&rdquo;，论证金沙江才是长江源头，把&ldquo;读万卷书，行万里路&rdquo;实践到了极致。</p>\n<p class="p_text_indent_2">如果将时间线进一步拉长，这里的人们总是以己之人生与壮阔时代紧密结合，传承着事事关心、务实奋进的担当基因。&ldquo;九一八&rdquo;事变爆发，考入清华时国文历史满分、物理只有5分的钱伟长毅然弃文从理，终成中国近代力学之父；经济改革先驱孙冶方少时立志，要让沉沉的黑夜闪动起熠熠的火光，为中国经济发展绘制蓝图；从荡口出发，王莘在天安门广场前为祖国欣欣向荣的情景打动，一曲《歌唱祖国》传唱至今；信知暮寒已轻浅，盛放东风第一枝，胡福明勇开思想先河，写下《实践是检验真理的唯一标准》&hellip;&hellip;</p>\n<p class="p_text_indent_2">一座座地标、一个个名人串联起的精神图谱，勾勒着一座城市知所来、明所往的发展轨迹。</p>\n<p class="p_text_indent_2">历史学家许倬云比较家乡无锡与苏州、常州时这样说，&ldquo;和苏州的富商大贾、庭园诗酒不同；和常州的状元宰相之家，收集文物、书籍的风气，也颇为不同。&rdquo;&ldquo;无锡的读书人家，不只是读八股文考取功名&hellip;&hellip;其选择的项目，通常以实用为主。以今日的分类而言，就是数、理、化，以及与数学、哲学有关的音韵、乐律。此外，则是与民生有关的社会经济。&rdquo;</p>\n<p class="p_text_indent_2">今天，无锡这曲&ldquo;江南调&rdquo;的主旋律依旧是&ldquo;工业风&rdquo;，企业家们更专注、打深井，诞生了大量细分领域的隐形冠军。</p>\n<p class="p_text_indent_2">无锡入围中国企业、中国制造业、中国服务业、中国民营企业四张500强榜单的企业总数，多年稳居全省第一。2023年，规上工业总产值超2.5万亿元，规模超2000亿元的产业集群达6个，比2022年增加4个。</p>\n<p class="p_text_indent_2">深厚人文贯通历史，前沿产业塑造未来。无锡市长赵建军说，将继续厚植实业之基，推动物联网、集成电路、生物医药、软件与信息技术服务等4大产业加快发展，形成6个优势产业和5个未来产业为支撑的&ldquo;465&rdquo;现代产业集群。</p>\n<p><img src="https://news.jschina.com.cn/scroll/szyw/202401/W020240119711367629907.png"></p>\n<p class="p_text_indent_2">斗米尺布，政在养民</p>\n<p class="p_text_indent_2">不久前，一条&ldquo;江南水乡斗米尺布&rdquo;文物主题游径新鲜出炉。40多处文物点，串联起&ldquo;苏湖一熟天下足&rdquo;&ldquo;贻谷高义传千秋&rdquo;&ldquo;农桑锡纺工商兴&rdquo;等六大文物主题。</p>', 20, 'https://news.seu.edu.cn/2024/0123/c5485a479839/page.htm', 10, 10, NULL, 1, '2025-05-19 12:56:47', '2025-05-21 13:14:38'),
	(4, '哈哈哈哈', '发发发', '', '', '<h2 style="text-align: center;">TinyMCE provides a <span style="text-decoration: underline;">full-featured</span> rich text editing experience, and a featherweight download.</h2>\n<p style="text-align: center;"><strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">No matter what you\'re building, TinyMCE has got you covered.对对对</span></span></strong></p>', NULL, '哈哈哈', 10, 10, '[1, 3, 4, 5]', 1, '2025-05-21 12:41:27', '2025-05-21 12:41:27');

-- 导出  表 onedatabase.permissions 结构
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menuName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menuCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `operation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_permissions_permissions` (`parent_id`),
  CONSTRAINT `FK_permissions_permissions` FOREIGN KEY (`parent_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.permissions 的数据：~17 rows (大约)
INSERT INTO `permissions` (`id`, `menuName`, `menuCode`, `operation`, `created_at`, `updated_at`, `parent_id`) VALUES
	(1, '权限管理', 'permission', 'add,update,delete', '2025-05-06 13:35:25', '2025-06-18 12:54:53', 13),
	(2, '员工管理', 'user', 'add,update,delete', '2025-05-06 13:36:25', '2025-06-18 12:51:36', 13),
	(3, '部门管理', 'department', 'add,update,delete', '2025-05-06 13:36:54', '2025-06-18 12:51:42', 13),
	(8, '角色管理', 'role', 'add,update,delete', '2025-05-07 13:57:15', '2025-06-18 12:52:13', 13),
	(9, '首页', 'home', '', '2025-05-10 08:59:54', '2025-05-11 03:47:37', NULL),
	(10, '首页', 'home-index', '', '2025-05-10 09:00:18', '2025-06-18 12:53:56', 9),
	(11, '关于我们', 'about', '', '2025-05-10 09:00:39', '2025-05-11 03:46:30', NULL),
	(12, '关于我们', 'about-index', '', '2025-05-10 09:01:59', '2025-06-18 12:51:06', 11),
	(13, '系统管理', 'system', '', '2025-05-10 09:50:41', '2025-05-10 09:50:41', NULL),
	(14, '资讯管理', 'news', '', '2025-05-11 03:47:53', '2025-05-11 03:49:20', NULL),
	(15, '新闻资讯', 'news-manage', 'add,update,delete,audit', '2025-05-11 03:48:44', '2025-06-18 12:50:39', 14),
	(16, '栏目管理', 'column', 'add,update,delete', '2025-05-11 03:49:11', '2025-06-18 12:50:18', 14),
	(17, ' 商品管理', 'product', '', '2025-05-28 12:02:42', '2025-06-18 13:01:08', NULL),
	(18, '宠物管理', 'pets', 'add,update,delete,export,import,audit', '2025-05-28 12:03:06', '2025-06-18 12:24:20', 17),
	(19, '字典管理', 'dict', 'add,update,delete', '2025-05-28 12:03:27', '2025-06-18 12:11:27', 17),
	(20, '宠物实体', 'pet-single', '', '2025-05-29 12:17:59', '2025-06-18 12:49:53', 18);

-- 导出  表 onedatabase.pets 结构
CREATE TABLE IF NOT EXISTS `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `pictures` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `color` int DEFAULT NULL COMMENT '颜色',
  `type` int DEFAULT NULL COMMENT '种类猫啊狗啊',
  `years` int DEFAULT NULL COMMENT '几岁几月',
  `vaccine` int DEFAULT NULL COMMENT '疫苗接种情况',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `creater_id` int DEFAULT NULL,
  `updater_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `color` (`color`) USING BTREE,
  KEY `type` (`type`) USING BTREE,
  KEY `years` (`years`) USING BTREE,
  KEY `vaccine` (`vaccine`) USING BTREE,
  KEY `FK_pets_users` (`creater_id`),
  KEY `FK_pets_users_2` (`updater_id`),
  CONSTRAINT `FK_pets_users` FOREIGN KEY (`creater_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_pets_users_2` FOREIGN KEY (`updater_id`) REFERENCES `users` (`id`),
  CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`color`) REFERENCES `dicts` (`id`),
  CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`type`) REFERENCES `dicts` (`id`),
  CONSTRAINT `pets_ibfk_3` FOREIGN KEY (`years`) REFERENCES `dicts` (`id`),
  CONSTRAINT `pets_ibfk_4` FOREIGN KEY (`vaccine`) REFERENCES `dicts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.pets 的数据：~4 rows (大约)
INSERT INTO `pets` (`id`, `name`, `description`, `price`, `pictures`, `color`, `type`, `years`, `vaccine`, `status`, `created_at`, `updated_at`, `creater_id`, `updater_id`) VALUES
	(1, '等等', '<p>等等222</p>', 222.00, 'http://localhost:3000/uploads/1749127715644-th.jpg;http://localhost:3000/uploads/1749127924270-b527e9092a92092e64e37dc0905abadf1f8fe339.jpg@96w_96h.avif;http://localhost:3000/uploads/1749127938406-021fcfa647f63233cf62ca4660300141490dbb33.jpg@96w_96h.avif;http://localhost:3000/uploads/1749127943566-th.jpg;http://localhost:3000/uploads/1749127949248-021fcfa647f63233cf62ca4660300141490dbb33.jpg@96w_96h.avif', 2, 9, NULL, NULL, NULL, '2025-06-03 13:38:10', '2025-06-05 12:52:31', 11, 11),
	(2, '哈士奇', '<p>纯种哈士奇3月龄500米</p>', 500.00, 'http://localhost:3000/uploads/1749037840980-th.jpg', 4, 6, NULL, NULL, NULL, '2025-06-04 11:51:12', '2025-06-04 11:51:12', 11, 11),
	(3, '哈士奇', '<p>纯种哈士奇3月龄500米</p>', 500.00, 'http://localhost:3000/uploads/1749037840980-th.jpg', 4, 6, NULL, NULL, NULL, '2025-06-04 11:51:14', '2025-06-04 11:51:14', 11, 11),
	(4, '医用仓鼠', '<p>医用仓鼠6月龄</p>\n<p><em>量很大</em></p>', 2.00, 'http://localhost:3000/uploads/1749037951275-th.jpg', 3, 9, NULL, NULL, NULL, '2025-06-04 11:52:37', '2025-06-04 11:53:58', 11, 11);

-- 导出  表 onedatabase.roles 结构
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `permission` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.roles 的数据：~2 rows (大约)
INSERT INTO `roles` (`id`, `roleName`, `description`, `created_at`, `updated_at`, `permission`) VALUES
	(1, '超级管理员', '超管', '2025-05-07 13:46:22', '2025-06-23 13:15:39', '{"dict": ["add", "update", "delete"], "home": [], "news": [], "pets": ["add", "update", "delete", "export", "import", "audit"], "role": ["add", "update", "delete"], "user": ["add", "update", "delete"], "about": [], "column": ["add", "update", "delete"], "system": [], "product": [], "department": ["add", "update", "delete"], "home-index": [], "permission": ["add", "update", "delete"], "pet-single": [], "about-index": [], "news-manage": ["add", "update", "delete", "audit"]}'),
	(2, '管理员', '很多权限的账号', '2025-05-07 13:55:53', '2025-06-23 13:38:50', '{"dict": ["add", "update", "delete"], "home": [], "news": [], "pets": ["add", "update", "delete", "export", "import"], "about": [], "column": ["add", "update", "delete"], "product": [], "home-index": [], "pet-single": [], "about-index": [], "news-manage": ["add", "update", "delete"]}');

-- 导出  表 onedatabase.role_users 结构
CREATE TABLE IF NOT EXISTS `role_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `role_id` (`role_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  CONSTRAINT `role_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.role_users 的数据：~6 rows (大约)
INSERT INTO `role_users` (`id`, `role_id`, `user_id`, `created_at`, `updated_at`) VALUES
	(3, 1, 6, '2025-05-08 14:31:17', '2025-05-08 14:31:17'),
	(4, 1, 8, '2025-05-08 14:31:24', '2025-05-08 14:31:24'),
	(5, 1, 7, '2025-05-08 14:31:32', '2025-05-08 14:31:32'),
	(8, 1, 11, '2025-05-10 06:10:14', '2025-05-10 06:10:14'),
	(9, 1, 10, '2025-05-10 06:10:44', '2025-05-10 06:10:44'),
	(10, 2, 1, '2025-05-10 06:11:13', '2025-05-10 06:11:13');

-- 导出  表 onedatabase.users 结构
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(24) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` int DEFAULT (1) COMMENT '0 已删除 1正常 2已离职',
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.users 的数据：~11 rows (大约)
INSERT INTO `users` (`id`, `email`, `phone`, `password`, `username`, `hire_date`, `status`, `updated_at`) VALUES
	(1, 'lixuguang_1988@163.com', '15651967076', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'lixuguang', NULL, 1, '2025-04-28 13:30:02'),
	(2, 'lixuguang_1989@163.com', '15651967076', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'lixuguang2', NULL, 1, '2025-04-28 13:30:02'),
	(3, 'zhangsan@liji.com', NULL, 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'zhagnsan', NULL, 1, '2025-04-28 13:30:02'),
	(4, 'susan@liji.com', '15651009999', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'susan', NULL, 0, '2025-04-30 05:55:27'),
	(5, 'zhangjike@liji.com', '15651001234', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'zhangjike', NULL, 1, '2025-04-28 13:30:02'),
	(6, 'quanhongchan@liji.com', '15651001234', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'quanhongchan', NULL, 1, '2025-04-28 13:30:02'),
	(7, 'mayinglong@liji.com', '15651001234', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'mayinglong', NULL, 1, '2025-04-28 13:30:02'),
	(8, 'damotou@liji.com', '15651001234', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'damotou', NULL, 1, '2025-04-28 13:30:02'),
	(9, '5100@one.com', '15651005106', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'one', NULL, 0, '2025-04-30 06:12:50'),
	(10, '5102@one.com', '15651005100', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'admin', NULL, 1, '2025-04-28 13:30:02'),
	(11, '5200@one.com', '15652005202', 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', 'root', NULL, 1, '2025-04-28 13:30:02'),
	(12, NULL, NULL, 'bbafe45f02abbc94492bac68da6a92007e97defdc00ba3206cd4cbcdd37136ad', NULL, NULL, 0, '2025-05-26 12:39:43');

-- 导出  表 onedatabase.user_departments 结构
CREATE TABLE IF NOT EXISTS `user_departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `department_id` (`department_id`),
  KEY `FK_user_departments_users` (`user_id`),
  CONSTRAINT `FK_user_departments_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_departments_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在导出表  onedatabase.user_departments 的数据：~4 rows (大约)
INSERT INTO `user_departments` (`id`, `employee_id`, `department_id`, `created_at`, `updated_at`, `user_id`) VALUES
	(1, NULL, 2, '2025-04-17 12:01:01', '2025-04-17 12:01:01', 1),
	(2, NULL, 2, '2025-04-17 12:03:29', '2025-04-17 12:03:29', 5),
	(3, NULL, 2, '2025-04-17 12:03:29', '2025-04-17 12:03:29', 6),
	(4, NULL, 2, '2025-04-17 12:03:29', '2025-04-17 12:03:29', 7);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
