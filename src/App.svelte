<script>
  import TailwindCSS from "./TailwindCSS.svelte";
  import TomatoSvg from "./TomatoSvg.svelte";

  let started = false;
  let currentEvent, remainingSeconds;
  let sessionCount = 0;

  const events = [
    {
      name: "Session",
      duration: 25 * 60,
    },
    {
      name: "Short break",
      duration: 5 * 60,
    },
    {
      name: "Long break",
      duration: 20 * 60,
    },
  ];

  function selectEvent(index) {
    currentEvent = index;
    remainingSeconds = events[currentEvent].duration;
    started = false;
  }

  function secondsToTime(e) {
    const m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, "0");

    return m + ":" + s;
  }

  async function requestPermission() {
    if (Notification.permission !== "denied") {
      await Notification.requestPermission();
    }
  }

  function sendNotification(title, body) {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          dateOfArrival: Date.now(),
          primaryKey: Math.random(),
        });
      });
    }
  }

  selectEvent(0);
  requestPermission();

  setInterval(() => {
    if (started && remainingSeconds > 0) {
      remainingSeconds--;
    }

    if (remainingSeconds === 0) {
      if (currentEvent === 0) {
        sessionCount++;

        if (sessionCount >= 4) {
          selectEvent(2);
          sessionCount = 0;
        } else {
          selectEvent(1);
        }
        sendNotification(
          "Your working sesson is over!",
          "Enjoy your well deserved break!"
        );
      } else {
        sendNotification("Your break is over!", "You should get back to work!");
        selectEvent(0);
      }
    }
  }, 1000);
</script>

<main class="md:flex md:justify-center md:items-center md:h-screen">
  <div class="h-screen md:h-auto max-w-md p-5 flex flex-col justify-center">
    <h1
      class="flex justify-center items-center text-5xl text-red-800 text-center -mb-2">
      timato
      <TomatoSvg />
    </h1>

    <div class="p-4 bg-white rounded-t-lg shadow">
      <div class="grid grid-cols-2 gap-2 items-center">
        <div>
          <h1 class="text-4xl text-center">
            {secondsToTime(remainingSeconds)}
          </h1>
        </div>

        <div class="grid gap-1">
          {#each events as { name }, i}
            <button
              class="text-sm tracking-wider py-3 px-4 rounded {currentEvent === i ? 'bg-red-700 text-red-100' : 'bg-gray-500 text-gray-300 opacity-75'}"
              on:click={() => selectEvent(i)}>{name}</button>
          {/each}
        </div>
      </div>
    </div>

    <button
      class="font-bold text-xl tracking-wider p-4 rounded-b-lg shadow {started ? 'bg-blue-500 text-blue-900' : 'bg-green-500 text-green-900'}"
      on:click={() => (started = !started)}>
      {#if started}Pause{:else}Start{/if}
    </button>
  </div>
</main>

<TailwindCSS />
