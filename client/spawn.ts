import { sleep } from '@overextended/ox_lib';
import { cache } from '@overextended/ox_lib/client';
import { OxPlayer } from './player';
import { PlayerEvents } from 'types';

DoScreenFadeOut(0);
NetworkStartSoloTutorialSession();
setTimeout(() => emitNet(PlayerEvents.playerJoined));

async function StartSession() {
  if (IsPlayerSwitchInProgress()) {
    StopPlayerSwitch();
  }

  if (GetIsLoadingScreenActive()) {
    SendLoadingScreenMessage('{"fullyLoaded": true}');
    ShutdownLoadingScreenNui();
  }

  NetworkStartSoloTutorialSession();
  DoScreenFadeOut(0);
  ShutdownLoadingScreen();
  SetPlayerControl(cache.playerId, false, 0);
  SetPlayerInvincible(cache.playerId, true);

  // while (!OxPlayer.isLoaded) {
  //   DisableAllControlActions(0);
  //   ThefeedHideThisFrame();
  //   HideHudAndRadarThisFrame();

  //   await sleep(0);
  // }

  NetworkEndTutorialSession();
  SetPlayerControl(cache.playerId, true, 0);
  SetPlayerInvincible(cache.playerId, false);
  SetMaxWantedLevel(0);
  NetworkSetFriendlyFireOption(true);
  SetPlayerHealthRechargeMultiplier(cache.playerId, 0.0);
}

StartSession()