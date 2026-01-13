import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error: unknown) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      // eslint-disable-next-line
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);

      // eslint-disable-next-line
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error: unknown) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // #1 option
    // const pokemon = await this.findOne(id);

    // await pokemon.deleteOne();

    // #2 option
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    // #3 option
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id ${id} not found`);
  }

  private handleExceptions(error: any) {
    const mongoError = error as { code?: number; keyValue?: unknown };
    if (mongoError.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(mongoError.keyValue)}`,
      );
    }

    console.log(error);

    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
