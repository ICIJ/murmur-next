import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { library, default as Fa } from "@/components/Fa";

describe("Fa", () => {
  it("is a FontAwesomeIcon component", () => {
    expect(Fa.name).toBe("FontAwesomeIcon");
  });

  it("has a library that define a `add` method", () => {
    expect(library.add).toBeDefined();
  });

  it("has a library that `add` method", () => {
    library.add(faTimes);
    expect(library.definitions.fas.times).toBeDefined();
  });
});
