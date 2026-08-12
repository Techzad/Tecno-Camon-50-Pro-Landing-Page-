/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveScene {
  HeroIntro = 0,
  CameraStory = 1,
  Performance = 2,
  WaterResistant = 3,
  DesignForm = 4,
  TecnoAI = 5,
  HiOS = 6,
  FinalOutro = 7
}

export interface SpecItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  description: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageIndex: number;
}
