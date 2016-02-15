/* Copyright IBM Corp. 2015, 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /**
   * # Watson Avatar
   * Displays an animated Watson Avatar.
   *
   * ## Usage
   * 1. Create a placeholder element for the avatar:
   * ```html
   *   <div id="watson-avatar-container"></div>
   * ```
   *
   * 2. Initialize the avatar using JavaScript
   * ```javascript
   *   var container = document.querySelector('#watson-avatar-container');
   *   var watson = new window.Watson();
   *   watson.load('myavatar', container);
   * ```
   *
   * 3. Optionally, set state, color and a custom center image using javascript
   * ```javascript
   *   watson.setState('listening');
   *   watson.setColor('#fff');
   *   watson.setImage('images/my-image.svg');
   * ```
   */

  // watson-avatar.min.svg
  var svgContents = '<!--(c) Copyright 2001-2015 IBM Corporation. All rights reserved.--><svg id="watson" class="watson" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 120 120" preserveAspectRatio="xMinYMin meet" role="img"><title>Watson Avatar</title><desc/><g><circle class="watson-stroke" stroke="#000" stroke-width="2" cx="60" cy="60" r="38" fill="none"/><g><image id="c-i" x="0" y="0" height="100%" width="100%" display="none"/></g><!--eb--><g id="e-1" class="e" opacity="0"><path class="watson-fill" fill="#000" d="M40.9 91.1c-.4-.5-.7-1-1.1-1.5-.7-1-1.5-2-2.2-3.1-.1-.2-.3-.4-.5-.7-.3-.4-.6-.9-.9-1.3-.3-.4-.6-.9-.9-1.3-.8-1.2-1.6-2.3-2.4-3.5-.1-.2-.3-.4-.4-.6-.1-.1-.1-.2-.2-.3-.6-.9-1.2-1.9-1.8-2.8-2.7-4.3-5.5-9-8.2-14.1.1 1.3.2 2.6.4 3.8 2.2 3.9 4.5 7.6 6.7 11 .7 1 1.4 2.1 2 3.1.1.1.1.2.2.3.1.1.2.2.2.4.8 1.2 1.6 2.4 2.4 3.5.4.5.8 1.1 1.2 1.6.3.4.6.9.9 1.3.1.1.2.2.3.4.8 1.1 1.6 2 2.3 3 .4.5.7 1 1.1 1.4l.3.3 2.7 1.5-.9-1.2c-.4-.2-.8-.7-1.2-1.2z" clip-path="url(#e-1-m)"/><path id="e-1-g" stroke="none" d="M40.9 91.1c-.4-.5-.7-1-1.1-1.5-.7-1-1.5-2-2.2-3.1-.1-.2-.3-.4-.5-.7-.3-.4-.6-.9-.9-1.3-.3-.4-.6-.9-.9-1.3-.8-1.2-1.6-2.3-2.4-3.5-.1-.2-.3-.4-.4-.6-.1-.1-.1-.2-.2-.3-.6-.9-1.2-1.9-1.8-2.8-2.7-4.3-5.5-9-8.2-14.1" fill="none"/><circle class="watson-fill" fill="#000" stroke="none" r="2" cx="0" cy="0"><animateMotion class="e-1-a" begin="indefinite" dur="1000ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-1-g"/></animateMotion></circle><defs><clipPath id="e-1-m"><circle fill="#f00" r="80" cx="0" cy="80"><animateMotion class="e-1-a" begin="indefinite" dur="1000ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-1-g"/></animateMotion></circle></clipPath></defs><animate class="e-1-a" begin="indefinite" attributeType="CSS" attributeName="opacity" dur="1000ms" rotate="none" fill="freeze" values="1;1;0;0" keyTimes="0;.25;0.75;1"/></g><g id="e-2" class="e" opacity="0"><path class="watson-fill" fill="#000" d="M43.5 78.9c-.3-.4-.6-.8-.9-1.3-1.1-1.6-2.3-3.2-3.4-4.8-.1-.1-.2-.3-.3-.4-.5-.8-1.1-1.6-1.6-2.4-3.9-5.9-7.6-12.2-11-18.8-.6-1.3-1.3-2.5-1.9-3.8-.2.7-.5 1.4-.7 2.1l1.2 2.4c3.4 6.7 7.2 13 11.2 18.9.6.9 1.2 1.7 1.8 2.6.1.1.2.3.3.4 1.2 1.6 2.3 3.2 3.5 4.8l.9 1.2c1.8 2.3 13.3 15.5 15.7 17.9h1.3c-2.5-2.5-14.4-16.4-16.1-18.8z" clip-path="url(#e-2-m)"/><path id="e-2-g" stroke="none" stroke-miterlimit="10" d="M23.8 49.5l1.2 2.4c3.4 6.7 7.2 13 11.2 18.9.6.9 1.2 1.7 1.8 2.6.1.1.2.3.3.4 1.2 1.6 2.3 3.2 3.5 4.8l.9 1.2c1.8 2.3 13.3 15.5 15.7 17.9" fill="none"/><circle class="watson-fill" fill="#000" stroke="none" r="2" cx="0" cy="0"><animateMotion class="e-2-a" begin="indefinite" dur="1100ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-2-g"/></animateMotion></circle><defs><clipPath id="e-2-m"><circle fill="#f00" r="80" cx="0" cy="-80"><animateMotion class="e-2-a" begin="indefinite" dur="1100ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-2-g"/></animateMotion></circle></clipPath></defs><animate class="e-2-a" begin="indefinite" attributeType="CSS" attributeName="opacity" dur="1100ms" rotate="none" fill="freeze" values="1;1;0;0" keyTimes="0;.25;0.75;1"/></g><g id="e-3" class="e" opacity="0"><path class="watson-fill" fill="#000" d="M48.1 26.5c-.6-.6-1.3-1.2-1.9-1.8l-1.5.6c.5.5 5.4 5.2 7 6.9 1.2 1.2 12.5 15 14.6 18 .1.2.3.4.4.6.2.3.4.5.6.8.9 1.4 1.9 2.7 2.8 4.1.2.3.4.7.6 1 2.6 4 5 8 7.2 11.9 3.3 6.1 6.1 12 8.3 17.6.1.3.2.5.3.8l.6-.6c-.1-.2-.1-.3-.2-.5-2.2-5.8-4.9-11.8-8.2-17.9-2.1-4-4.5-8-7.1-12.1L71 55c-.9-1.4-1.8-2.7-2.7-4.1-.2-.3-.4-.5-.6-.8-.1-.2-.3-.4-.4-.7-2.1-3-13.4-17-14.6-18.2-1.3-1.4-2.6-2.8-4-4.1" clip-path="url(#e-3-m)"/><path id="e-3-g" stroke="none" stroke-miterlimit="10" d="M44.7 25.3c.5.5 5.4 5.2 7 6.9 1.2 1.2 12.5 15 14.6 18 .1.2.3.4.4.6.2.3.4.5.6.8.9 1.4 1.9 2.7 2.8 4.1.2.3.4.7.6 1 2.6 4 5 8 7.2 11.9 3.3 6.1 6.1 12 8.3 17.6" fill="none"/><circle class="watson-fill" fill="#000" stroke="none" r="2" cx="0" cy="0"><animateMotion class="e-3-a" begin="indefinite" dur="1200ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-3-g"/></animateMotion></circle><defs><clipPath id="e-3-m"><circle fill="#f00" r="80" cx="0" cy="-80"><animateMotion class="e-3-a" begin="indefinite" dur="1200ms" rotate="none" fill="freeze" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear"><mpath xlink:href="#e-3-g"/></animateMotion></circle></clipPath></defs><animate class="e-3-a" begin="indefinite" attributeType="CSS" attributeName="opacity" dur="1200ms" rotate="none" fill="freeze" values="1;1;0;0" keyTimes="0;.25;0.75;1"/></g><!--ee--><g class="e" id="e-fallback" opacity="0"><g opacity=".75"><g><path class="watson-fill" fill="#000" d="M69.66 56.22l-3.96 2.52c-1.32.9-2.64 1.86-3.96 2.76-.36.24-.66.48-1.02.72-.3.24-.66.48-1.02.72-.66.48-1.32.96-1.98 1.5-2.64 2.04-5.28 4.2-7.86 6.48-2.4 2.16-4.68 4.38-6.9 6.66l.9 1.26c2.22-2.34 4.56-4.56 7.02-6.78 2.52-2.28 5.1-4.44 7.68-6.48.66-.54 1.32-1.02 1.98-1.5.3-.24.66-.48.96-.78.3-.24.66-.48.96-.72 1.32-.96 2.64-1.86 3.9-2.82 1.32-.9 2.58-1.74 3.9-2.58.12-.12.3-.18.42-.3-.18-.3-.42-.66-.66-.96-.06.12-.18.18-.36.3z"/></g><g><path class="watson-fill" fill="#000" d="M92.22 45.48c-.72.24-1.5.54-2.34.84-.42.12-.84.3-1.32.48-.48.18-.9.36-1.38.54-.96.42-1.98.78-3.06 1.26s-2.16 1.02-3.3 1.56c-.66.3-1.32.66-2.04 1.02.12.18.24.36.36.48.06.06.12.12.18.24.6-.36 1.26-.66 1.86-.96 1.14-.54 2.22-1.14 3.24-1.62 1.02-.48 2.04-.96 3-1.38.48-.18.9-.42 1.38-.6.42-.18.9-.36 1.26-.54.84-.3 1.56-.6 2.28-.9.72-.24 1.32-.48 1.92-.66-.06-.12-.06-.18-.12-.3-.54.12-1.2.24-1.92.54z"/></g><g><path class="watson-fill" fill="#000" d="M36.78 84.54c.3.42.6.84.9 1.32 1.68-2.04 3.48-4.08 5.34-6.06l-.9-1.26c-1.86 1.92-3.66 3.96-5.34 6z"/></g><g><path class="watson-fill" fill="#000" d="M35.94 85.56c-.48.54-.9 1.14-1.32 1.68.36.36.78.72 1.14 1.02.36-.48.72-.96 1.14-1.44-.3-.42-.66-.84-.96-1.26z"/></g><g><path class="watson-fill" fill="#000" d="M78.3 51.36c-.36.18-.66.36-1.02.54-.6.3-1.2.66-1.86.96-.66.3-1.26.72-1.86 1.08-.66.36-1.26.72-1.92 1.14-.18.12-.36.18-.54.3.18.3.42.6.6.96.18-.12.3-.18.48-.3.66-.36 1.26-.78 1.86-1.14.6-.36 1.2-.78 1.86-1.08.6-.36 1.2-.66 1.8-1.02.36-.24.78-.42 1.14-.66-.06-.06-.06-.12-.12-.12-.12-.3-.3-.48-.42-.66z"/></g></g><g opacity=".5"><g><path class="watson-fill" fill="#000" d="M52.02 32.88c1.14 1.2 2.28 2.46 3.36 3.66-.36.48-.66 1.08-.78 1.68-.3 1.92 1.02 3.72 3 4.02.84.12 1.62-.06 2.28-.42 2.28 2.88 4.5 5.82 6.54 8.7.12.18.3.42.42.6.18.24.36.54.54.78.96 1.32 1.86 2.7 2.7 4.02.24.3.42.66.66.96 2.58 3.96 4.92 7.86 7.08 11.76 3.3 5.94 6 11.82 8.16 17.34.12.24.18.54.3.78l.54-.54c-.06-.18-.12-.3-.18-.48-2.1-5.58-4.74-11.52-7.98-17.52-2.1-3.9-4.44-7.92-6.96-11.88-.18-.3-.42-.6-.6-.96-.9-1.32-1.8-2.7-2.7-4.02-.18-.24-.36-.54-.54-.78-.12-.24-.3-.42-.42-.66-2.1-2.94-4.26-5.94-6.6-8.82.42-.48.66-1.08.78-1.74.3-1.92-1.02-3.72-2.94-4.02-.84-.12-1.62.06-2.28.42-1.08-1.26-2.22-2.52-3.36-3.78-1.26-1.38-2.58-2.7-3.96-4.02.3-.06.54-.06.84-.12 2.16-.24 4.32-.42 6.48-.54.54 0 1.02-.06 1.56-.06 2.04-.06 3.96-.06 5.94-.06 4.44.12 8.64.42 12.48.9.96.12 1.92.24 2.82.36.24.06.42.06.66.12-.36-.18-.66-.42-1.02-.6-.78-.12-1.56-.24-2.4-.36-3.84-.48-8.04-.84-12.48-.96-2.1-.06-4.26-.06-6.48 0-.54 0-1.02.06-1.56.06-1.92.12-3.9.24-5.94.48-.42.06-.9.12-1.32.18-.6-.6-1.26-1.2-1.86-1.8-.48.18-.96.42-1.44.6.54.48 1.08.96 1.56 1.44-2.28.36-4.56.84-6.84 1.44-.6.36-1.14.78-1.68 1.14 3-.9 6.06-1.62 9.12-2.04 1.44 1.5 3 3.12 4.5 4.74zm38.76 27.5c.18-1.14 1.2-1.86 2.34-1.74 1.14.18 1.86 1.2 1.68 2.34-.18 1.08-1.2 1.86-2.34 1.68-1.08-.12-1.86-1.14-1.68-2.28z"/></g><g><path class="watson-fill" fill="#000" d="M41.46 90.9l-1.08-1.44c-.72-.96-1.5-1.98-2.22-3-.12-.24-.3-.42-.48-.66-.3-.42-.6-.84-.9-1.32l-.9-1.26c-.78-1.14-1.56-2.28-2.34-3.48-.12-.18-.24-.42-.42-.6-.06-.12-.12-.18-.18-.3-.6-.9-1.2-1.86-1.8-2.76-2.7-4.26-5.46-8.88-8.1-13.92.06 1.26.18 2.52.42 3.72 2.16 3.9 4.38 7.5 6.54 10.86.66 1.02 1.32 2.04 2.04 3.06.06.06.12.18.18.24.06.12.18.24.24.36.78 1.2 1.62 2.34 2.4 3.42.36.54.78 1.08 1.14 1.56.3.42.6.84.96 1.32.06.12.18.24.24.36.78 1.02 1.56 2.04 2.28 3l1.08 1.44c.06.12.18.24.24.3.84.54 1.74 1.02 2.64 1.5-.3-.42-.6-.78-.9-1.2-.42-.3-.78-.78-1.08-1.2z"/></g></g><g><g><path class="watson-fill" fill="#000" d="M57.3 26.64l-.12-.12c-1.08-.96-2.16-1.98-3.24-2.94-.48.06-.96.18-1.44.3 1.14.96 2.22 1.92 3.3 2.88.48-.12.96-.12 1.5-.12z"/></g><g><path class="watson-fill" fill="#000" d="M82.92 56.82c-1.08-1.56-2.28-3.24-3.54-4.98-.06-.06-.12-.12-.18-.24-.12-.18-.24-.36-.36-.48-.96-1.26-1.92-2.58-3-3.96-.24-.3-.42-.54-.66-.84-1.68-2.16-3.48-4.38-5.46-6.66-3.48-4.02-7.38-8.22-11.76-12.42-.48 0-1.02.06-1.56.06l.06.06c4.74 4.32 8.94 8.7 12.6 12.9 1.86 2.1 3.6 4.14 5.22 6.12.12.12.18.24.3.36.24.3.48.54.66.84 1.08 1.32 2.1 2.64 3.12 3.9.12.18.3.36.42.6.06.06.06.12.12.12 1.32 1.74 2.58 3.42 3.72 4.98 1.14 1.62 2.16 3.06 3.12 4.44.9 1.38 1.74 2.58 2.4 3.6.72 1.02 1.26 1.98 1.74 2.7.96 1.5 1.44 2.28 1.44 2.28s-.48-.78-1.38-2.28c-.48-.72-.96-1.68-1.68-2.76-.66-1.08-1.44-2.28-2.34-3.72-.9-1.5-1.92-3-3-4.62z"/></g><g><path class="watson-fill" fill="#000" d="M52.14 89.1c.18-.24.3-.54.36-.9.24-1.26-.66-2.46-1.92-2.7-.48-.06-.96 0-1.38.18-1.8-2.16-3.54-4.5-5.34-6.84l-.9-1.26c-1.14-1.56-2.22-3.12-3.3-4.74-.12-.12-.18-.24-.3-.42-.54-.78-1.08-1.56-1.56-2.34-3.84-5.82-7.5-12.06-10.8-18.54-.66-1.26-1.26-2.52-1.86-3.78-.24.66-.48 1.32-.66 2.04.42.78.78 1.62 1.2 2.4 3.36 6.6 7.14 12.78 11.04 18.66.6.84 1.14 1.68 1.74 2.52.12.12.18.24.24.36 1.14 1.62 2.28 3.18 3.42 4.74l.9 1.26c1.74 2.28 3.54 4.5 5.28 6.66-.24.3-.42.66-.48 1.08-.24 1.26.66 2.46 1.92 2.7.54.12 1.14 0 1.56-.3 2.4 2.7 4.86 5.22 7.2 7.56.42 0 .84 0 1.32.06-2.52-2.64-5.1-5.4-7.68-8.4z"/></g></g></g><g class="halo-state" id="listening"><circle class="watson-stroke" stroke="#000" r="40" cx="60" cy="60" fill="none"><animate id="lt" attributeName="r" attributeType="XML" begin="0s; lt.end + 1s" dur="1s" from="40" to="50"/><animate attributeName="opacity" attributeType="XML" begin="lt.begin" dur="1s" from="1" to="0"/><set attributeName="opacity" attributeType="XML" begin="lt.begin + 1s" dur="1s" to="0"/></circle></g><g class="halo-state fallback" id="listening-fallback" opacity="0"><circle class="watson-stroke" stroke="#000" r="45" cx="60" cy="60" fill="none"/></g><g class="halo-state" id="thinking"><path id="thinking-circle-top" stroke="none" d="M10 60c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50" fill="none"/><path id="thinking-arch-top" class="watson-stroke" stroke="#000" d="M10 60c0-27.6 22.4-50 50-50s50 22.4 50 50" clip-path="url(#thinking-arch-top-mask)" fill="none"/><defs><clipPath id="thinking-arch-top-mask"><circle r="30" cx="-30" cy="0"><animateMotion begin="tt.begin; tt.end + 1500ms" dur="3s" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-circle-top"/></animateMotion></circle></clipPath></defs><circle class="watson-fill" fill="#000" r="1" cx="0" cy="0" opacity="1"><animateMotion id="tt" begin="0s; tt.end + 1500ms" dur="1500ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-arch-top"/></animateMotion></circle><path id="thinking-circle-bottom" stroke="none" d="M110 60c0 27.6-22.4 50-50 50S10 87.6 10 60s22.4-50 50-50 50 22.4 50 50" fill="none"/><path id="thinking-arch-bottom" class="watson-stroke" stroke="#000" d="M110 60c0 27.6-22.4 50-50 50S10 87.6 10 60" clip-path="url(#thinking-arch-bottom-mask)" fill="none"/><defs><clipPath id="thinking-arch-bottom-mask"><circle r="30" cx="-30" cy="0"><animateMotion begin="tt.begin; tt.end + 1500ms" dur="3s" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-circle-bottom"/></animateMotion></circle></clipPath></defs><circle class="watson-fill" fill="#000" r="1" cx="0" cy="0" opacity="1"><animateMotion id="tb" begin="tt.begin; tt.end + 1500ms" dur="1500ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-arch-bottom"/></animateMotion></circle></g><g class="halo-state fallback" id="thinking-fallback" opacity="0"><g><g><path class="watson-stroke" stroke="#000" stroke-width="2" d="M60 10c27.6 0 50 22.4 50 50" fill="none"/></g><g><path class="watson-stroke" stroke="#000" stroke-width="2" d="M60 110c-27.6 0-50-22.4-50-50" fill="none"/></g></g><g><circle class="watson-stroke" stroke="#000" stroke-width="2" r="5" cx="110" cy="65" fill="none"/></g><g><circle class="watson-stroke" stroke="#000" stroke-width="2" r="5" cx="10" cy="55" fill="none"/></g></g><g class="halo-state" id="thinking-complete"><g><path id="thinking-complete-arch-TL" class="watson-stroke" stroke="#000" stroke-width="2" d="M10 60c0-27.6 22.4-50 50-50" clip-path="url(#thinking-complete-arch-TL-mask)" fill="none"/><path id="thinking-complete-arch-TR" class="watson-stroke" stroke="#000" stroke-width="2" d="M60 10c27.6 0 50 22.4 50 50" clip-path="url(#thinking-complete-arch-TR-mask)" fill="none"/><defs><clipPath id="thinking-complete-arch-TL-mask"><circle r="60" cx="-60" cy="0"><animateMotion begin="10ms" dur="300ms" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-complete-arch-TL"/></animateMotion></circle></clipPath><clipPath id="thinking-complete-arch-TR-mask"><circle r="60" cx="-60" cy="0"><animateMotion begin="300ms" dur="300ms" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-complete-arch-TR"/></animateMotion></circle></clipPath></defs><circle class="watson-fill" fill="#000" r="2" cx="0" cy="0" opacity="1"><animateMotion begin="0s" dur="300ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-complete-arch-TL"/></animateMotion><animateMotion begin="300ms" dur="300ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-complete-arch-TR"/></animateMotion><set attributeType="xml" begin="300ms" attributeName="r" to="1" dur="300ms" fill="freeze"/></circle><path id="thinking-complete-arch-BR" class="watson-stroke" stroke="#000" stroke-width="2" d="M110 60c0 27.6-22.4 50-50 50" clip-path="url(#thinking-complete-arch-BR-mask)" fill="none"/><path id="thinking-complete-arch-BL" class="watson-stroke" stroke="#000" stroke-width="2" d="M60 110c-27.6 0-50-22.4-50-50" clip-path="url(#thinking-complete-arch-BL-mask)" opacity="1" fill="none"/><defs><clipPath id="thinking-complete-arch-BR-mask"><circle r="60" cx="-60" cy="0"><animateMotion begin="0s" dur="300ms" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-complete-arch-BR"/></animateMotion></circle></clipPath><clipPath id="thinking-complete-arch-BL-mask"><circle r="60" cx="-60" cy="0"><animateMotion begin="300ms" dur="300ms" rotate="auto" fill="freeze"><mpath xlink:href="#thinking-complete-arch-BL"/></animateMotion></circle></clipPath></defs><circle class="watson-fill" fill="#000" r="2" cx="0" cy="0" opacity="1"><animateMotion begin="0s" dur="300ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-complete-arch-BR"/></animateMotion><animateMotion begin="300ms" dur="300ms" rotate="none" fill="freeze"><mpath xlink:href="#thinking-complete-arch-BL"/></animateMotion><set attributeType="xml" begin="300ms" attributeName="r" to="1" dur="300ms" fill="freeze"/></circle><set attributeName="opacity" to="0" dur="indefinite" begin="600ms"/></g><circle class="watson-stroke" stroke="#000" stroke-width="2" r="50" cx="60" cy="60" opacity="0" fill="none"><animate begin="600ms" attributeName="r" attributeType="XML" dur="500ms" fill="freeze" from="50" to="40"/><animate begin="600ms" attributeName="opacity" attributeType="XML" dur="500ms" fill="freeze" from="1" to="0"/></circle></g><g class="halo-state fallback" id="thinking-complete-fallback" opacity="0"><g><circle class="watson-stroke" stroke="#000" stroke-width="1" r="2" cx="60" cy="10" fill="none"/></g><g><circle class="watson-stroke" stroke="#000" stroke-width="1" r="2" cx="60" cy="110" fill="none"/></g></g></g></svg>';

  var getAndroidVersion = function () {
      var match;
      var ua = navigator.userAgent.toLowerCase();
      match = ua.match(/android\s([0-9\.]*)/);
      return match ? match[1] : false;
  };

  var getIEVersion = function () {
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('msie') !== -1) ? parseInt(ua.split('msie')[1]) : false;
  };

  /**
   * A helper for iterating a HTMLCollection
   */
  var forAll = function (elems, f) {
    var i;
    if (elems) {
      for (i = 0; i < elems.length; i++) {
        f(elems[i]);
      }
    }
  };

  /**
   * An attribute setter for a given attribute
   */
  var setAttribute = function (name, value) {
    return function (elem) {
      elem.setAttribute(name, value);
    };
  };
  /**
   * An style attribute setter for a given attribute
   */
  var setStyle = function (name, value) {
    return function (elem) {
      elem.style[name] = value;
    };
  };

  /**
   * Animate a single electron
   */
  var animateElectron = function (container, num, angle, speed, id) {
    var svgTag = container.querySelector('#e-' + num + id),
        electronAnimations = container.getElementsByClassName('e-' + num + '-a');

    if (svgTag) {
      svgTag.setAttribute('transform', 'rotate(' + angle + ' 60 60)');

      forAll(electronAnimations, function (ea) {
        ea.setAttribute('dur', speed + 'ms');
        ea.setAttribute('opacity', '1');
        ea.beginElement();
      });
    }
  };

  /**
   * Animate a set of electrons with given speed and frequency
   */
  var animateElectrons = function (container, speed, freq, id) {
    var numElectrons = 6,
        angles = [ 30, 50, 80, 130, 210, 340 ],
        baseAngle = 0,
        angle,
        i = 0;

    var animateNextElectron = function () {
      i = i % numElectrons;
      baseAngle = i === 0
                ? Math.round( Math.random() * (360 - 1) + 1)
                : baseAngle;
      angle = baseAngle + angles[i];
      i++;
      animateElectron(container, i, angle, speed, id);
    };

    animateNextElectron();
    return setInterval(animateNextElectron, freq);
  };

  window.Watson = function () {
    var container;
    var stateParams = {
      'default': {
        'speed': 800,
        'freq': 200
      },
      'thinking': {
        'speed': 400,
        'freq': 50,
        'haloDuration': 500
      },
      'thinking-complete': {
        'speed': 800,
        'freq': 200,
        'haloDuration': 300
      }
    };
    var electronInterval;

    var startElectrons = function (speed, freq, id) {
      clearInterval(electronInterval);
      electronInterval = animateElectrons(container, speed, freq, id );
    };

    var startHalos = function (id) {
      var svg = container.querySelector('#watson' + id);
      svg.setCurrentTime(0);
    };

    var hideHalos = function () {
      var haloStates = container.getElementsByClassName('halo-state');
      forAll(haloStates, setAttribute('opacity', 0));
    };

    var showHalo = function (id, state) {
      var halo = container.querySelector('#' + state + id);
      if (halo) {
        halo.setAttribute('opacity', 1);
      }
    };

    var setAccessibilityLabels = function (id, state) {
      var svg = container.querySelector('#watson' + id);
      var desc = container.querySelector('desc');
      var stateText = 'state: ' + state;

      svg.setAttribute('aria-label', 'Watson Avatar ' + stateText);
      desc.innerHTML = stateText;
    };

    this.state = 'default';
    this.color = 'black';

    this.setState = function (state) {
      var useFallback = parseFloat(getAndroidVersion()) < 4.4 || getIEVersion();
      var params = stateParams[state] || stateParams.default;
      var fallbackElectrons;

      hideHalos();

      if (useFallback) {
        fallbackElectrons = container.querySelector('#e-fallback' + this.id);
        fallbackElectrons.setAttribute('opacity', 1);
        showHalo(this.id, state + '-fallback');
      }
      else {
        startElectrons(params.speed, params.freq, this.id);
        startHalos(this.id);
        showHalo(this.id, state);
      }

      setAccessibilityLabels(this.id, state);

      this.state = state;
      this.setColor(this.color);
    };

    this.setColor = function (color) {
      var fills = container.getElementsByClassName('watson-fill'),
          strokes = container.getElementsByClassName('watson-stroke');

      this.color = color;

      forAll(fills, setAttribute('fill', color));
      forAll(strokes, setAttribute('stroke', color));
    };

    this.setImage = function (path) {
      var image = container.querySelector('#c-i');
      if (typeof path !== 'string' || path === 'none') {
        forAll(container.getElementsByClassName('e'), setStyle('display', 'block'));
        image.style.display = 'none';
      }
      else {
        forAll(container.getElementsByClassName('e'), setStyle('display', 'none'));
        image.setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', path);
        image.style.display = 'block';
      }
    };

    this.load = function (id, element) {
      var self = this,
          html = svgContents,
          eregex = /<!--eb-->(.*)<!--ee-->/,
          electronsHTMLDup,
          ids,
          i,
          j;
      container = element;
      this.id = id;
      electronsHTMLDup = eregex.exec(html)[1];
      for (j = 1; j < 4; j++) {
        electronsHTMLDup = electronsHTMLDup.split('e-' + j).join('e-' + (j + 3));
      }
      html = html.split('<!--ee-->').join(electronsHTMLDup);
      ids = [
        'watson',
        'e-1',
        'e-1-g',
        'e-1-m',
        'e-2',
        'e-2-g',
        'e-2-m',
        'e-3',
        'e-3-g',
        'e-3-m',
        'e-4',
        'e-4-g',
        'e-4-m',
        'e-5',
        'e-5-g',
        'e-5-m',
        'e-6',
        'e-6-g',
        'e-6-m',
        'e-fallback',
        'listening',
        'listening-fallback',
        'thinking',
        'thinking-fallback',
        'thinking-arch-top',
        'thinking-arch-top-mask',
        'thinking-arch-bottom',
        'thinking-arch-bottom-mask',
        'thinking-circle-top',
        'thinking-circle-bottom',
        'thinking-complete',
        'thinking-complete-fallback',
        'thinking-complete-arch-TL',
        'thinking-complete-arch-TR',
        'thinking-complete-arch-TL-mask',
        'thinking-complete-arch-TR-mask',
        'thinking-complete-arch-BR',
        'thinking-complete-arch-BL',
        'thinking-complete-arch-BR-mask',
        'thinking-complete-arch-BL-mask',
        'watson-scale',
        'watson-translate'
      ];
      for (i = 0; i < ids.length; i++) {
        //ids
        html = html.split('id="' + ids[i] + '"').join('id="' + ids[i] + id + '"');
        //motionpaths
        html = html.split('"#' + ids[i] + '"').join('"#' + ids[i] + id + '"');
        //clippingpaths
        html = html.split('url(#' + ids[i] + ')').join('url(#' + ids[i] + id + ')');
      }
      container.innerHTML = html;
      self.setState(self.state);
    };
  };
}());
