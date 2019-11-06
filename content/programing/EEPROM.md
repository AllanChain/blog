---
Title: Why is EEPROM called "ROM"?
Date: 2019-11-06T08:28:02+08:00
Author: Allan Chain
Categories: 
    - Electronics
ToC: false
---

After searching on the Internet, I found interesting facts:

- ROM: Read-Only Memory. Written at the factory.
- PROM: Programmable Read-Only Memory but programmable (once) by the user. Really a one-time programmable, forever readable memory. Get it wrong and you dump the chip.
- EPROM: Eraseable Programmable Read-Only Memory. Usually erased using UV light through a quartz window above the chip. A bit of trouble but very useful.
- EEPROM: Electrically Erasable Programmable Read-Only Memory. Can be erased or re-written under program control.

And early EEPROM devices could only be erased all together, and programming required conditions very different from those associated with normal operation; consequently, as with PROM/EPROM devices, they were generally used in circuitry which could read but not write them. 

So unlike RAM (random access memory) which holds its contents during power cycle and, therefore, behaved more like a ROM.

To conclude, EEPROM was hard to erase and write, and is more often read than written. So it still served more like a ROM.

### About the relationship between EEPROM and flash memory

EEPROM is in fact Flash.

EEPROM is an evolution of the older UV-eraseable EPROMs (EEPROM's "EE" stands for "Electrically Eraseable"). However, despite it being an improvement to its old pal, today's EEPROM's way of holding information is the exact same of the flash memory.

The ONLY major difference between the two is the read/write/erase logic.

- NAND Flash (regular flash)
- NOR Flash (aka EEPROM)

Reference:

- [What is the difference between Flash memory and EEPROM?](https://electronics.stackexchange.com/questions/69234/what-is-the-difference-between-flash-memory-and-eeprom)
- [EEPROM is a “Read Only Memory,” so why can I write to it?](https://electronics.stackexchange.com/questions/243712/eeprom-is-a-read-only-memory-so-why-can-i-write-to-it)
