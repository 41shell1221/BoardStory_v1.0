'use strict'

const game = new Game(5.0);

const editor = game.addScene(new Scene());
editor.color = '#eff';

const ed_header = editor.addChildObject(new RoundedRectangle(0, 0, 0, 44, [0, 0, 7, 7], '#fff'));
ed_header.anchor_max.x = 1;
ed_header.shadowBlur = 8;

const ed_hd_title = ed_header.addChildObject(new Text('Untitled', 6, 0, 6, 0, 18, '#000'));
ed_hd_title.anchor_max = {x: 1, y: 1};

const ed_hd_exit = ed_header.addChildObject(new RoundedRectangle(-4, 0, 36, 36, 6, '#9990'));
{
  ed_hd_exit.anchor_max = {x: 1, y: 0.5};
  ed_hd_exit.anchor_min = {x: 1, y: 0.5};
  ed_hd_exit.pivot = {x: 1, y: 0.5};
  ed_hd_exit.isPointerTarget = true;
  ed_hd_exit.isButton = true;
  ed_hd_exit.secondColor = '#999';
}

const ed_hd_exit_icon = ed_hd_exit.addChildObject(new Sprite('img/menu.png', 0, 0, 0, 0));
ed_hd_exit_icon.anchor_min = {x: 0.25, y: 0.25};
ed_hd_exit_icon.anchor_max = {x: 0.75, y: 0.75};

const ed_hd_save = ed_header.addChildObject(new RoundedRectangle(-44, 0, 36, 36, 6, '#9990'));
{
  ed_hd_save.anchor_max = {x: 1, y: 0.5};
  ed_hd_save.anchor_min = {x: 1, y: 0.5};
  ed_hd_save.pivot = {x: 1, y: 0.5};
  ed_hd_save.isPointerTarget = true;
  ed_hd_save.isButton = true;
  ed_hd_save.secondColor = '#999';
}

const ed_hd_save_icon = ed_hd_save.addChildObject(new Sprite('img/save.png', 0, 0, 0, 0));
ed_hd_save_icon.anchor_min = {x: 0.15, y: 0.15};
ed_hd_save_icon.anchor_max = {x: 0.85, y: 0.85};

const ed_hd_execute = ed_header.addChildObject(new RoundedRectangle(-84, 0, 36, 36, 6, '#9990'));
{
  ed_hd_execute.anchor_max = { x: 1, y: 0.5 };
  ed_hd_execute.anchor_min = { x: 1, y: 0.5 };
  ed_hd_execute.pivot = { x: 1, y: 0.5 };
  ed_hd_execute.isPointerTarget = true;
  ed_hd_execute.isButton = true;
  ed_hd_execute.secondColor = '#999';
}

const ed_hd_execute_icon = ed_hd_execute.addChildObject(new Sprite('img/execute.png', 0, 0, 0, 0));
ed_hd_execute_icon.anchor_min = { x: 0.18, y: 0.18};
ed_hd_execute_icon.anchor_max = { x: 0.82, y: 0.82};

const ed_feature = editor.addChildObject(new RoundedRectangle(0, 0, 0, 240, [7, 7, 0, 0], '#fff'));
{
  ed_feature.anchor_min = {x: 0, y: 1};
  ed_feature.anchor_max = {x: 1, y: 1};
  ed_feature.pivot.y = 1;
  ed_feature.shadowBlur = 8;
}

const ed_ft_settings = ed_feature.addChildObject(new Rectangle(0, 0, 0, 48, '#0000'));
{
  ed_ft_settings.anchor_min = {x: 0, y: 1};
  ed_ft_settings.anchor_max = {x: 1, y: 1};
  ed_ft_settings.pivot.y = 1;
}

const ed_ft_st_basicRule = ed_ft_settings.addChildObject(new RoundedRectangle(-65, 0, 120, 36, 6, '#9990'));
{
  ed_ft_st_basicRule.anchor_min = { x: 0.5, y: 0.5 };
  ed_ft_st_basicRule.anchor_max = { x: 0.5, y: 0.5 };
  ed_ft_st_basicRule.pivot = { x: 0.5, y: 0.5 };
  ed_ft_st_basicRule.outlineWidth = 4;
  ed_ft_st_basicRule.outlineColor = '#000';
  ed_ft_st_basicRule.isPointerTarget = true;
  ed_ft_st_basicRule.isButton = true;
  ed_ft_st_basicRule.secondColor = '#999';
}

const ed_ft_st_br_text = ed_ft_st_basicRule.addChildObject(new Text('基本設定', 0, 0, 0, 0, 16, '#000'));
{
  ed_ft_st_br_text.anchor_min = { x: 0.5, y: 0.5 };
  ed_ft_st_br_text.anchor_max = { x: 0.5, y: 0.5 };
  ed_ft_st_br_text.pivot = { x: 0.5, y: 0.5 };
  ed_ft_st_br_text.textAlign = ed_ft_st_br_text.TEXTALIGN.CENTER;
}

const ed_ft_st_winJudge = ed_ft_settings.addChildObject(new RoundedRectangle(65, 0, 120, 36, 6, '#9990'));
{
  ed_ft_st_winJudge.anchor_min = {x: 0.5, y: 0.5};
  ed_ft_st_winJudge.anchor_max = {x: 0.5, y: 0.5};
  ed_ft_st_winJudge.pivot = {x: 0.5, y: 0.5};
  ed_ft_st_winJudge.outlineWidth = 4;
  ed_ft_st_winJudge.outlineColor = '#000';
  ed_ft_st_winJudge.isPointerTarget = true;
  ed_ft_st_winJudge.isButton = true;
  ed_ft_st_winJudge.secondColor = '#999';
}

const ed_ft_st_wj_text = ed_ft_st_winJudge.addChildObject(new Text('勝敗判定', 0, 0, 0, 0, 16, '#000'));
{
  ed_ft_st_wj_text.anchor_min = { x: 0.5, y: 0.5 };
  ed_ft_st_wj_text.anchor_max = { x: 0.5, y: 0.5 };
  ed_ft_st_wj_text.pivot = { x: 0.5, y: 0.5 };
  ed_ft_st_wj_text.textAlign = ed_ft_st_wj_text.TEXTALIGN.CENTER;
}


game.main = () => {
  
}


game._start();