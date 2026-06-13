#!/usr/bin/env python3
"""生成卡牌像素肖像（16x16），输出 JS 数组片段。"""
from __future__ import annotations

W = 16


def pad(rows: list[str]) -> list[str]:
    out = []
    for r in rows:
        if len(r) > W:
            raise ValueError(f"row too long ({len(r)}): {r}")
        out.append(r.ljust(W, "_"))
    while len(out) < W:
        out.append("_" * W)
    return out[:W]


SPRITES: dict[str, list[str]] = {}

# —— 将领 ——
SPRITES["nezha"] = pad([
    "____HH__HH____",
    "___RRWWWWRR___",
    "__RRWWLLWWRR__",
    "__RRWLLLLWRR__",
    "__RRWWLLWWRR__",
    "___RRRRRRRR___",
    "____RRRRRR____",
    "____RRRRRR____",
    "___HH____HH___",
    "__VVVV__VVVV__",
    "___RR____RR___",
    "__VV_______VV_",
    "____HH__HH____",
    "___VV____VV___",
])

SPRITES["erlang"] = pad([
    "____AAAAAA____",
    "___CCWWWWCC___",
    "__CCWWLLWWCC__",
    "__CCWWSSWWCC__",
    "__CCWWLLWWCC__",
    "___CCCCCCCC___",
    "____CCCCCC____",
    "____CC__CC____",
    "____CC__CC____",
    "____CC__CC____",
    "____CC__CC____",
    "____II__II____",
    "____II__II____",
])

SPRITES["jiang"] = pad([
    "____WWWWWW____",
    "___DDWWWWDD___",
    "__DDWWLLWWDD__",
    "__DDWLLLLWDD__",
    "___DDWWWWDD___",
    "____DDDDDD____",
    "____DD__DD____",
    "____DD__DD____",
    "____DD__DD____",
    "___CC___CC____",
    "____CC__CC____",
    "_____CC_CC____",
    "_______CC_____",
])

SPRITES["leizhenzi"] = pad([
    "___YYYY__YYYY__",
    "__YCCCCCCCCYY_",
    "_YCCCWWWWCCCYY",
    "_YCCCWLLWCCCYY",
    "__YCCCCCCCCYY_",
    "___YYYYYYYY___",
    "____YYYYYY____",
    "____YY__YY____",
    "____YY__YY____",
])

SPRITES["huangtian"] = pad([
    "_____AAAA_____",
    "___AAWWWWAA___",
    "__AAWWLLWWAA__",
    "__AAWGLLGWAA__",
    "__AAWWIIWWAA__",
    "___AAGGGGAA___",
    "____GGGGGG____",
    "___GGGGGGGG___",
    "__GG______GG__",
    "__GG______GG__",
    "___II____II___",
])

SPRITES["tuxing"] = pad([
    "____BBBBBB____",
    "___BBWWWWBB___",
    "__BBWWLLWWBB__",
    "__BBWBLLBWBB__",
    "___BBBBBBBB___",
    "____BBBBBB____",
    "____BBBBBB____",
    "___BBBBBBBB___",
    "__BBBBBBBBBB__",
    "__BB______BB__",
    "__BB______BB__",
    "___DD____DD___",
])

SPRITES["weihu"] = pad([
    "____MMMMMM____",
    "___MMWWWWMM___",
    "__MMWWLLWWMM__",
    "__MMWWIIWWMM__",
    "__MMMMMMMMMM__",
    "__MMWWWWWWMM__",
    "__MMWWAAWWMM__",
    "__MMMMMMMMMM__",
    "__MM______MM__",
    "__MM______MM__",
    "___AA____AA___",
])

SPRITES["huangfeihu"] = pad([
    "____OOOOOO____",
    "___OOIIIIIO___",
    "__OOIIIIIIIO__",
    "__OOWWLLWWOO__",
    "__OOOOOOOOOO__",
    "___OOOOOOOO___",
    "____OOOOOO____",
    "___TTTTTTTT___",
    "__OOOOOOOOOO__",
    "__OO______OO__",
    "__OO______OO__",
    "___TT____TT___",
])

# —— 法宝 ——
SPRITES["qiankun"] = pad([
    "_____AAAA_____",
    "___AAAAAAAA___",
    "__AA______AA__",
    "__AA_AAAA_AA__",
    "__AA_AAAA_AA__",
    "__AA______AA__",
    "___AAAAAAAA___",
    "_____AAAA_____",
    "____UAAAU_____",
    "___AAAAAAAA___",
    "__AA______AA__",
])

SPRITES["huntian"] = pad([
    "____RRRRRR____",
    "___RRRRRRRR___",
    "__RR____RRRR__",
    "_RR______RRR__",
    "__RR____RRRR__",
    "___RRRRRRRR___",
    "____RRRRRR____",
    "_____RRRR_____",
    "______RR______",
    "______RR______",
    "_____VVVV_____",
])

SPRITES["dashen"] = pad([
    "_____AAAA_____",
    "____AAAAAA____",
    "___AA____AA___",
    "__AA______AA__",
    "_AA________AA_",
    "AA__________AA",
    "_AAAAAAAAAAAA_",
    "___AAAAAAAA___",
    "_____AAAA_____",
    "____UAAAU_____",
    "_____UUU______",
])

SPRITES["xinghuang"] = pad([
    "_______D______",
    "_______D______",
    "______YYY_____",
    "_____YYYYY____",
    "____YYYYYYY___",
    "____YYYYYYY___",
    "____YYYYYYY___",
    "_____YYYYY____",
    "______YYY_____",
    "_______D______",
    "_______D______",
    "_____UUUUU____",
])

SPRITES["dingfeng"] = pad([
    "_____CCCC_____",
    "___CCCCCCCC___",
    "__CCWWWWWWCC__",
    "__CCWCCCCWCC__",
    "__CCCCCCCCCC__",
    "__CCSSSSSSCC__",
    "__CCCCCCCCCC__",
    "___CCCCCCCC___",
    "_____CCCC_____",
    "___CC____CC___",
    "____SS__SS____",
])

SPRITES["huojian"] = pad([
    "_______HH_____",
    "______HHHH____",
    "_____HHVVHH___",
    "______HHVV____",
    "_______VV_____",
    "_______VV_____",
    "_______VV_____",
    "_______VV_____",
    "______DDDD____",
    "_____DD__DD___",
    "_____VV__VV___",
])

SPRITES["leigong"] = pad([
    "_____YYYY_____",
    "___YYYYYYYY___",
    "__YYSSSSSSYY__",
    "__YYYYYYYYYY__",
    "___YYYYYYYY___",
    "_____YYYY_____",
    "______YY______",
    "______YY______",
    "_____VVVV_____",
    "____VV__VV____",
    "____DD__DD____",
])

# —— 阵法 ——
SPRITES["bagua"] = pad([
    "_____BBBB_____",
    "___BBCCCCBB___",
    "__BCCCCCCCBB__",
    "__BCCBBCCBB__",
    "__BCCBBCCBB__",
    "__BCCCCCCCBB__",
    "___BBCCCCBB___",
    "_____BBBB_____",
    "_____UUUU_____",
    "___BBBBBBBB___",
    "__BB______BB__",
])

SPRITES["shijue"] = pad([
    "_____KKKK_____",
    "___KKKKKKKK___",
    "__KK______KK__",
    "__KK__KK__KK__",
    "__KK__KK__KK__",
    "___KKKKKKKK___",
    "_____KKKK_____",
    "_____K__K_____",
    "___KKKKKKKK___",
    "__KK______KK__",
    "____VV__VV____",
])

SPRITES["huanghe"] = pad([
    "_____CCCC_____",
    "___CCCCCCCC___",
    "__CCCCCCCCCC__",
    "_CCCCCCCCCCCC_",
    "__CCCCCCCCCC__",
    "___CCCCCCCC___",
    "____CCCCCC____",
    "_____CCCC_____",
    "___CC____CC___",
    "____VV__VV____",
])

SPRITES["wanxian"] = pad([
    "_____NNNN_____",
    "___NNWWWWNN___",
    "__NNWNWNWNWN__",
    "__NNWWWWWWNN__",
    "___NNWWWWNN___",
    "____NNNNNN____",
    "____NNNNNN____",
    "___NNNNNNNN___",
    "__NN______NN__",
    "____UU__UU____",
])

# —— 谋略 ——
SPRITES["fengshen_scroll"] = pad([
    "_____PPPP_____",
    "___PPWWWWPP___",
    "__PPWWRRWWPP__",
    "__PPWRRRRWPP__",
    "__PPWWRRWWPP__",
    "___PPWWWWPP___",
    "_____PPPP_____",
    "_____UUUU_____",
    "___PPPPPPPP___",
    "__PP______PP__",
    "____AA__AA____",
])

SPRITES["chuidiao"] = pad([
    "____DDDDDD____",
    "___DDWWWWDD___",
    "__DDWWLLWWDD__",
    "___DD____DD___",
    "____DD__DD____",
    "___DDDDDDDD___",
    "__CCCCCCCCCC__",
    "__CCCCCCCCCC__",
    "____CC__CC____",
    "_____CC_CC____",
    "_______CC_____",
])

SPRITES["jieshi"] = pad([
    "_____GGGG_____",
    "___GGWWWWGG___",
    "__GGWWRRWWGG__",
    "__GGWRRRRWGG__",
    "__GGWWRRWWGG__",
    "___GGWWWWGG___",
    "_____GGGG_____",
    "_____UUUU_____",
    "___GGGGGGGG___",
    "__GG______GG__",
    "____SS__SS____",
])

SPRITES["mingzhong"] = pad([
    "_____OOOO_____",
    "___OOOOOOOO___",
    "__OOOOYYYYOO__",
    "__OOYYYYYYOO__",
    "__OOYYYYYYOO__",
    "__OOOOOOOOOO__",
    "___OOOOOOOO___",
    "_____OOOO_____",
    "_____UUUU_____",
    "___OOOOOOOO___",
    "____VV__VV____",
])

SPRITES["podao"] = pad([
    "_____EEEE_____",
    "___EEEEEEEE___",
    "__EEWWRRWWEE__",
    "__EEWRRRRWEE__",
    "__EEWRRRRWEE__",
    "__EEWWRRWWEE__",
    "___EEEEEEEE___",
    "_____UUUU_____",
    "___EEEEEEEE___",
    "____SS__SS____",
])

# —— 神位卡 ——
SPRITES["zhaogongming"] = pad([
    "____YYYYYY____",
    "___YYWWWWYY___",
    "__YYWWGGWWYY__",
    "__YYWGGGGWYY__",
    "___YYYYYYYY___",
    "____YYYYYY____",
    "___YY____YY___",
    "___YY____YY___",
    "___UU____UU___",
    "____AA__AA____",
])

SPRITES["daji_card"] = pad([
    "____QQ____QQ__",
    "___OOFFFFOO___",
    "__OOFFLLFFOO__",
    "__OOWWLLWWOO__",
    "__OOORRRROO__",
    "___OOOOOOOO___",
    "____OOOOOO____",
    "___QQ____QQ___",
    "__OOOOOOOOOO__",
    "____FF__FF____",
])

SPRITES["sanxiao_card"] = pad([
    "____CCCCCC____",
    "___CCAAAACC___",
    "__CCAAAAAACC__",
    "__CCACACACCC__",
    "__CCAAAAAACC__",
    "___CCAAAACC___",
    "____CCCCCC____",
    "____UUUUUU____",
    "___CCCCCCCC___",
    "__CC______CC__",
])

SPRITES["wenzong_card"] = pad([
    "____KKKKKK____",
    "___KKWWWWKK___",
    "__KKWWEEWWKK__",
    "__KKWWWWWWKK__",
    "___KKKKKKKK___",
    "____KKKKKK____",
    "___KKKKKKKK___",
    "__KK______KK__",
    "__KK______KK__",
    "____AA__AA____",
])

SPRITES["treasure"] = SPRITES["qiankun"]
SPRITES["formation"] = SPRITES["bagua"]
SPRITES["strategy"] = SPRITES["fengshen_scroll"]
SPRITES["fengshen"] = SPRITES["zhaogongming"]

for k, rows in SPRITES.items():
    for i, r in enumerate(rows):
        if len(r) != W:
            raise SystemExit(f"{k}[{i}] len={len(r)}: {r!r}")

keys = [
    "nezha","erlang","jiang","leizhenzi","huangtian","tuxing","weihu","huangfeihu",
    "qiankun","huntian","dashen","xinghuang","dingfeng","huojian",
    "bagua","shijue","huanghe","wanxian",
    "fengshen_scroll","chuidiao","jieshi","mingzhong","podao","leigong",
    "treasure","formation","strategy","fengshen",
    "zhaogongming","daji_card","sanxiao_card","wenzong_card",
]

print("// CARD PORTRAITS 16x16")
for key in keys:
    rows = SPRITES[key]
    inner = ",".join(f"'{r}'" for r in rows)
    print(f"  {key}: [{inner}],")
