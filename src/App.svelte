<script>
  let started = false;
  let currentEvent, remainingSeconds;
  let sessionCount = 0;

  const events = [
    {
      name: "Session",
      duration: 25,
    },
    {
      name: "Short break",
      duration: 5,
    },
    {
      name: "Long break",
      duration: 20,
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

  function sendNotification(text) {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Timato", {
          body: text,
          tag: "timato",
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
        sendNotification("Your working sesson is over!");
      } else {
        sendNotification("Your break is over!");
        selectEvent(0);
      }
    }
  }, 1000);
</script>

<main class="md:flex md:justify-center md:items-center md:h-screen">
  <div class="h-screen md:h-auto max-w-md p-5 flex flex-col justify-center">
    <h1
      class="text-6xl text-red-800 text-center"
      style="margin-bottom: -1.75rem">
      Timato
    </h1>

    <div class="p-4 bg-red-100 rounded-t-lg shadow">
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
      class="text-xl tracking-wider p-4 rounded-b-lg shadow {started ? 'bg-blue-500 text-blue-900' : 'bg-green-500 text-green-900'}"
      on:click={() => (started = !started)}>
      {started ? 'Pause 💤' : 'Start 🍅'}
    </button>
  </div>
</main>
